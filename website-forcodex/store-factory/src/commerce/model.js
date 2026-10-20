import { validateSections } from '../sections/sectionModel.js';
import { themes, themeById, getDemoStores, buildStoreFromTemplate } from './templates/index.js';

export { themes, themeById };
export const uid = () => crypto.randomUUID();
export const pageLabels = { home:'Home', shop:'Shop', product:'Product detail', cart:'Cart', checkout:'Checkout', collections:'Collections', services:'Services', about:'About', contact:'Contact', faq:'FAQ', search:'Search results', notfound:'404' };
export const sectionLabels = { hero:'Hero', collections:'Collections', products:'Product selection', categories:'Category links', banner:'Promotional banner', testimonials:'Testimonials', logos:'Brand logos', newsletter:'Newsletter', richtext:'Text & image', services:'Services', faq:'FAQ', catalog:'Product grid & filters', product:'Product details', cart:'Shopping cart', checkout:'Checkout form', contact:'Contact details', search:'Search results', notfound:'Not found', custom:'Custom section' };

export const clone = value => structuredClone(value);
export const slugify = text => text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,63).replace(/-$/,'');
export const validSlug = value => typeof value==='string' && value.length<=63 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value) && !['www','admin','api','app','auth','assets'].includes(value);
export const money = (value,currency='USD') => new Intl.NumberFormat('en',{style:'currency',currency}).format(value);
export const cents = value => Math.round(Number(value)*100);
export const priceOf = (product,variant) => variant?.price!=='' && variant?.price!=null ? Number(variant.price) : product.salePrice!=='' && product.salePrice!=null ? Number(product.salePrice) : Number(product.price);
export const safeImage = value => /^\/(commerce|template-images)\/[a-z0-9-]+\.(webp|png|jpg|jpeg)$/i.test(value) || /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value) || (()=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}})();
export function onColor(hex) { const rgb=hex.slice(1).match(/../g)?.map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4); if(!rgb)return '#ffffff';const l=rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;return (l+.05)/.05>1.05/(l+.05)?'#000000':'#ffffff'; }

export function section(type,options={}) {
  return {id:uid(),type,visible:true,layout:'split',spacing:'regular',background:'default',title:sectionLabels[type],text:'',image:'',button:'',target:'shop',source:'featured',limit:4,items:[],...options};
}

export function newStore(themeId='tradehouse') {
  return buildStoreFromTemplate(themeId);
}

export function newProduct() { 
  return {id:uid(),name:'',sku:'',price:0,salePrice:'',stock:0,status:'draft',description:'',specifications:'',shipping:'',images:[],category:'',collections:[],featured:false,bestSeller:false,createdAt:new Date().toISOString(),variants:[],reviews:[]}; 
}

export function demoStores() {
  return getDemoStores();
}
export function validateStore(site,{publish=false}={}) {
  if(!site.name?.trim())throw new Error('Add the client’s store name.');
  if(!validSlug(site.slug))throw new Error('Use a unique address with lowercase letters, numbers and hyphens (up to 63 characters).');
  if(!themes.some(theme=>theme.id===site.theme))throw new Error('Select a supported theme.');
  if(site.client?.domain&&!/^(?=.{1,253}$)[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,63}$/.test(site.client.domain))throw new Error('Enter a lowercase domain only, without https://, paths or ports.');
  const settings=site.settings;
  if(!/^#[0-9a-f]{6}$/i.test(settings.color)||!/^#[0-9a-f]{6}$/i.test(settings.background))throw new Error('Use six-digit hex colours.');
  if(!['USD','AED','PKR'].includes(settings.currency))throw new Error('Choose a supported currency.');
  if(settings.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email))throw new Error('Check the email address.');
  if(settings.whatsapp&&!/^\+?[1-9]\d{7,14}$/.test(settings.whatsapp))throw new Error('Use a WhatsApp country code and 8–15 digits.');
  const skus=new Set(); const ids=new Set(); const imageList=[settings.logo];
  for(const product of site.products){
    if(!product.name.trim()||!product.sku.trim())throw new Error('Every product needs a name and SKU.');
    if(ids.has(product.id))throw new Error('Product IDs must be unique.');ids.add(product.id);
    if(skus.has(product.sku.toLowerCase()))throw new Error('Every product and variant needs a unique SKU.');skus.add(product.sku.toLowerCase());
    if(!Number.isFinite(Number(product.price))||product.price<0||product.price>10000000)throw new Error('Use a valid product price.');
    if(product.salePrice!==''&&(!Number.isFinite(Number(product.salePrice))||product.salePrice<0||Number(product.salePrice)>=Number(product.price)))throw new Error('Sale prices must be lower than the regular price.');
    if(!Number.isInteger(Number(product.stock))||product.stock<0)throw new Error('Stock must be a non-negative whole number.');
    if(!['draft','published'].includes(product.status))throw new Error('Choose a valid product status.');
    const variantIds=new Set();
    for(const variant of product.variants){
      if(!variant.name.trim()||!variant.sku.trim()||skus.has(variant.sku.toLowerCase())||variantIds.has(variant.id))throw new Error('Each variant needs a name and unique SKU.');
      variantIds.add(variant.id);skus.add(variant.sku.toLowerCase());
      if(!Number.isInteger(Number(variant.stock))||variant.stock<0)throw new Error('Variant stock must be a non-negative whole number.');
      if(variant.price!==''&&(!Number.isFinite(Number(variant.price))||variant.price<0))throw new Error('Use a valid variant price.');
    }
    imageList.push(...product.images);
    for(const review of product.reviews)if(!review.name.trim()||!review.text.trim()||!Number.isInteger(Number(review.rating))||review.rating<1||review.rating>5)throw new Error('Reviews need an author, text and a rating from 1 to 5. Use only approved real reviews.');
  }
  for(const collection of site.collections)imageList.push(collection.image);
  for(const [key,sections] of Object.entries(site.pages)){
    if(!pageLabels[key]||!Array.isArray(sections))throw new Error('Invalid page configuration.');
    for(const block of sections){if(!sectionLabels[block.type])throw new Error('Unsupported section.');if(block.type==='custom')validateSections([block.definition]);imageList.push(block.image,...(block.items||[]).map(item=>item.image||''));}
  }
  if(!Array.isArray(site.sectionLibrary||[])||(site.sectionLibrary||[]).length>100)throw new Error('The custom section library supports up to 100 saved designs.');
  for(const record of site.sectionLibrary||[])validateSections([record.section]);
  if(imageList.some(image=>image&&!safeImage(image)))throw new Error('Use HTTPS URLs or uploaded PNG, JPEG and WebP images.');
  if(!settings.shippingMethods.length||settings.shippingMethods.some(method=>!method.name.trim()||!Number.isFinite(Number(method.price))||method.price<0))throw new Error('Add at least one valid shipping method.');
  const codes=new Set();for(const coupon of settings.coupons){if(!coupon.code.trim()||codes.has(coupon.code.toUpperCase())||!['percent','fixed'].includes(coupon.type)||!Number.isFinite(Number(coupon.amount))||coupon.amount<0||(coupon.type==='percent'&&coupon.amount>100))throw new Error('Check coupon codes and amounts.');codes.add(coupon.code.toUpperCase());}
  if(publish&&!settings.email&&!settings.phone&&!settings.whatsapp)throw new Error('Add a contact method before publishing.');
  if(JSON.stringify(site).length>14000000)throw new Error('This store is too large. Use hosted image URLs for large catalogues.');
  return {...clone(site),name:site.name.trim()};
}
export function cartSummary(store,cart,couponCode='',shippingId='') {
  const lines=[];
  for(const item of cart){const product=store.products.find(p=>p.id===item.productId&&p.status==='published');if(!product)continue;const variant=product.variants.find(v=>v.id===item.variantId);if(product.variants.length&&!variant)continue;const stock=Number(variant?.stock??product.stock);const quantity=Math.max(0,Math.min(Math.floor(Number(item.quantity)||0),stock,99));if(!quantity)continue;lines.push({product,variant,quantity,unitCents:cents(priceOf(product,variant)),key:`${product.id}:${variant?.id||''}`});}
  const subtotal=lines.reduce((sum,line)=>sum+line.unitCents*line.quantity,0);
  const coupon=store.settings.coupons.find(c=>c.enabled&&c.code.toUpperCase()===couponCode.trim().toUpperCase());
  const discount=coupon?Math.min(subtotal,coupon.type==='percent'?Math.round(subtotal*Number(coupon.amount)/100):cents(coupon.amount)):0;
  const shipping=store.settings.shippingMethods.find(method=>method.id===shippingId)||store.settings.shippingMethods[0];
  const shippingCents=lines.length?cents(shipping?.price||0):0;
  return {lines,subtotal,discount,shipping,shippingCents,total:subtotal-discount+shippingCents,coupon};
}
