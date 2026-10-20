import {createClient} from '@supabase/supabase-js';
import {demoStores,validateStore,clone,cartSummary,uid} from './model.js';
const url=import.meta.env.VITE_SUPABASE_URL,key=import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configured=Boolean(url&&key);
export const supabase=configured?createClient(url,key):null;
const storageKey='store-factory:commerce:v1';
export function readLocal(){
  let raw;try{raw=localStorage.getItem(storageKey);}catch{throw new Error('Browser storage is unavailable. Allow storage to use the local workspace.');}
  const defaultStores=demoStores();
  if(!raw){const initial={stores:defaultStores,publications:defaultStores.map(data=>({id:data.id,slug:data.slug,data:clone(data),published_at:new Date().toISOString()})),orders:[],subscribers:[]};writeLocal(initial);return initial;}
  try{
    const value=JSON.parse(raw);
    if(!Array.isArray(value.stores)||!Array.isArray(value.publications))throw new Error();
    let updated=false;
    for(const ds of defaultStores){
      if(!value.stores.some(s=>s.slug===ds.slug)){
        value.stores.unshift(clone(ds));
        value.publications.unshift({id:ds.id,slug:ds.slug,data:clone(ds),published_at:new Date().toISOString()});
        updated=true;
      }
    }
    if(updated)writeLocal(value);
    return value;
  }catch{throw new Error('Saved local data could not be read. Export browser storage before resetting site data.');}
}
function writeLocal(value){try{localStorage.setItem(storageKey,JSON.stringify(value));}catch{throw new Error('Not enough browser storage. Use smaller images or hosted image URLs.');}}
function unwrap({data,error}){if(error)throw new Error(error.code==='23505'?'That address or identifier is already in use.':error.message);return data;}
export async function loadWorkspace(demo,user){
  if(demo)return readLocal();if(!supabase)throw new Error('Configure Supabase first.');if(!user)return {stores:[],publications:[],orders:[],subscribers:[]};
  const stores=unwrap(await supabase.from('commerce_stores').select('id,data,updated_at').eq('owner_id',user.id)).map(row=>({...row.data,_revision:row.updated_at}));
  if(!stores.length)return {stores,publications:[],orders:[],subscribers:[]};
  const ids=stores.map(site=>site.id);
  const results=await Promise.all([supabase.from('commerce_publications').select('*').in('id',ids),supabase.from('commerce_orders').select('*').in('store_id',ids).order('created_at',{ascending:false}).limit(100),supabase.from('commerce_subscribers').select('*').in('store_id',ids).limit(100)]);
  return {stores,publications:unwrap(results[0]),orders:unwrap(results[1]),subscribers:unwrap(results[2])};
}
export async function saveStore(value,demo,user,publish=false){
  const data=validateStore(value,{publish});delete data._revision;
  if(demo){const workspace=readLocal();if(workspace.stores.some(s=>s.slug===data.slug&&s.id!==data.id))throw new Error('That store address is already in use.');const previous=workspace.stores.find(s=>s.id===data.id);if(previous?._revision&&value._revision!==previous._revision)throw new Error('This store changed in another window or after an order. Reload it before saving.');data._revision=new Date().toISOString();workspace.stores=[data,...workspace.stores.filter(s=>s.id!==data.id)];if(publish){if(workspace.publications.some(s=>s.slug===data.slug&&s.id!==data.id))throw new Error('That published address is already in use.');workspace.publications=[{id:data.id,slug:data.slug,data:clone(data),published_at:new Date().toISOString()},...workspace.publications.filter(s=>s.id!==data.id)];}writeLocal(workspace);return data;}
  if(!user||!supabase)throw new Error('Sign in before saving this store.');
  const result=unwrap(await supabase.rpc('save_commerce_store',{payload:data,expected_revision:value._revision||null,publish_now:publish}));
  return {...result.data,_revision:result.updated_at};
}
export async function unpublishStore(id,demo){if(demo){const data=readLocal();data.publications=data.publications.filter(s=>s.id!==id);writeLocal(data);}else unwrap(await supabase.from('commerce_publications').delete().eq('id',id));}
export async function loadPublic(route,demo){
  if(demo)return route.kind==='slug'?readLocal().publications.find(s=>s.slug===route.value)?.data||null:null;
  if(!supabase)return null;let query=supabase.from('commerce_publications').select('data');
  if(route.kind==='domain'){const mapping=unwrap(await supabase.from('commerce_domains').select('store_id').eq('hostname',route.value).eq('verified',true).maybeSingle());if(!mapping)return null;query=query.eq('id',mapping.store_id);}else if(route.kind==='slug')query=query.eq('slug',route.value);else return null;
  return unwrap(await query.maybeSingle())?.data||null;
}
export async function domainsFor(id){return supabase?unwrap(await supabase.from('commerce_domains').select('hostname,verified').eq('store_id',id)):[];}
export async function placeOrder(store,cart,customer,coupon,shippingId,requestId,demo){
  if(demo){const data=readLocal();const duplicate=data.orders.find(order=>order.store_id===store.id&&order.request_id===requestId);if(duplicate)return duplicate;const live=data.publications.find(s=>s.id===store.id);if(!live)throw new Error('This store is no longer published.');const summary=cartSummary(live.data,cart,coupon,shippingId);if(!summary.lines.length)throw new Error('Your cart is empty.');if(summary.lines.length!==cart.length||summary.lines.some(line=>line.quantity!==cart.find(item=>`${item.productId}:${item.variantId||''}`===line.key)?.quantity))throw new Error('Stock has changed. Refresh the store and review your cart.');
    const order={id:uid(),store_id:store.id,request_id:requestId,customer:clone(customer),lines:summary.lines.map(line=>({productId:line.product.id,variantId:line.variant?.id||'',name:line.product.name,variant:line.variant?.name||'',quantity:line.quantity,unitCents:line.unitCents})),total:summary.total,currency:store.settings.currency,status:'pending_payment',created_at:new Date().toISOString()};
    for(const target of [live.data,data.stores.find(s=>s.id===store.id)]){if(!target)continue;for(const line of summary.lines){const product=target.products.find(p=>p.id===line.product.id);if(!product)continue;const stockTarget=line.variant?product.variants.find(v=>v.id===line.variant.id):product;if(stockTarget)stockTarget.stock=Math.max(0,Number(stockTarget.stock)-line.quantity);}target._revision=new Date().toISOString();}
    data.orders.unshift(order);writeLocal(data);return order;
  }
  return unwrap(await supabase.rpc('place_commerce_order',{store_id:store.id,items:cart,customer_details:customer,coupon_code:coupon,shipping_id:shippingId,request_id:requestId}));
}
export async function subscribe(storeId,email,demo){
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Enter a valid email address.');
  if(demo){const data=readLocal();if(!data.subscribers.some(s=>s.store_id===storeId&&s.email===email.toLowerCase()))data.subscribers.push({id:uid(),store_id:storeId,email:email.toLowerCase(),created_at:new Date().toISOString()});writeLocal(data);return;}
  unwrap(await supabase.rpc('subscribe_commerce_newsletter',{store_id:storeId,email_address:email}));
}
