# Morrow Studio

One-page concept studio site built with React, Vite, and Motion for React (the current Framer Motion package). The dark-purple theme takes visual inspiration from XOneHub, while the layout, words, and concept imagery are original.

## Preview locally

From this folder, run:

```text
npm install
npm run dev
```

Then open the local URL printed by Vite. To make the static build, run `npm run build`; the result is in `dist/`.

The page includes scroll-linked image and type motion, service selection, two concept studies, responsive navigation, reduced-motion support, and an inquiry draft form. The form validates and creates a copyable draft locally; it does not send a message.

Generated image prompts:

- `public/images/morrow-chrome-study.png`: high-end editorial photograph of angular chrome and translucent violet acrylic on a near-black studio stage; no words, logos, people, or UI.
- `public/images/morrow-violet-study.png`: gallery-style photograph of violet acrylic intersecting a matte black monolith with a restrained magenta edge light; no words, logos, people, or UI.

Both images were created with the built-in image generation tool and copied into this project. Earlier paper-study images are retained in `public/images/` but are no longer used by the page.
