# Premium Scroll-Linked Text Reveal Animation (Framer Motion)

This document explains how to create the ultra-smooth, premium word-by-word (or character-by-character) scroll-linked text reveal animation used in the Evan Austin website.

## 1. The Core Component: `ScrollRevealWord`

This component takes a `progress` value (from `useScroll`) and maps it to a specific `range` to smoothly interpolate the text color from a base color (e.g., dark gray) to an active color (e.g., white).

```tsx
import { motion, useTransform } from "framer-motion";

export const ScrollRevealWord = ({ 
  children, 
  progress, 
  range, 
  colors = ["#525252", "#ffffff"], 
  className 
}: { 
  children: React.ReactNode;
  progress: any; // scrollYProgress from useScroll
  range: [number, number]; // e.g. [0.2, 0.4]
  colors?: string[]; // Must be solid HEX colors for smooth interpolation
  className?: string;
}) => {
  // Smoothly interpolate between the two colors based on the scroll progress mapping to the specified range
  const color = useTransform(progress, range, colors);
  return (
    <motion.span style={{ color }} className={className}>
      {children}
    </motion.span>
  );
};
```

**Crucial Tips for the Component:**
- **Always use HEX colors** for the `colors` array (e.g., `["#525252", "#ffffff"]`). Avoid using RGBA with transparency (like `rgba(255,255,255,0.6)`) as Framer Motion struggles to interpolate alpha channels as smoothly as solid hex colors, leading to jerky transitions.
- Use `motion.span` so it sits directly inline with your text.

## 2. Implementing the Scroll Trigger

Attach a `useScroll` hook to the container that holds your text. The `offset` determines how much you need to physically scroll down the page to complete the animation.

```tsx
import { useRef } from "react";
import { useScroll } from "framer-motion";

const MySection = () => {
  const containerRef = useRef<HTMLElement>(null);
  
  // Track scroll progress of the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // "start 85%" -> Animation starts when the TOP of the container hits 85% of the viewport height (near the bottom of the screen).
    // "center 40%" -> Animation ends when the CENTER of the container hits 40% of the viewport height (slightly above middle).
    // The larger the physical gap between these two points, the longer and smoother the scroll interpolation will be.
    offset: ["start 85%", "center 40%"]
  });

  return <section ref={containerRef}>...</section>
}
```

## 3. Sequential Orchestration (The Secret to Smoothness)

If you have multiple text blocks in the same section, **do not map them all from `[0, 1]`**. If they all share the exact same range, they will all light up simultaneously, making the animation look chaotic and cheap.

Instead, slice the `[0, 1]` progress range into sequential chunks so the text lights up chronologically as the user scrolls down.

### Example: Animating Multiple Elements Sequentially

```tsx
// 1. First element animates from 0% to 10% of the scroll progress
<div className="uppercase">
  <ScrollRevealWord progress={scrollYProgress} range={[0.0, 0.05]}>Take</ScrollRevealWord>{" "}
  <ScrollRevealWord progress={scrollYProgress} range={[0.05, 0.1]}>Action</ScrollRevealWord>
</div>

// 2. Second element animates from 10% to 40%
<h1 className="text-6xl font-bold">
  <ScrollRevealWord progress={scrollYProgress} range={[0.1, 0.2]}>START</ScrollRevealWord>{" "}
  <ScrollRevealWord progress={scrollYProgress} range={[0.2, 0.3]}>YOUR</ScrollRevealWord>{" "}
  <ScrollRevealWord progress={scrollYProgress} range={[0.3, 0.4]}>JOURNEY</ScrollRevealWord>
</h1>

// 3. A dynamic paragraph animates from 40% to 80%
<p>
  {paragraphWords.map((word, i) => {
    // Map each word sequentially to a slice of the [0.4, 0.8] range
    const rangeSize = 0.4;
    const start = 0.4 + (i / paragraphWords.length) * rangeSize;
    const end = 0.4 + ((i + 1) / paragraphWords.length) * rangeSize;
    
    return (
      <span key={i}>
        <ScrollRevealWord progress={scrollYProgress} range={[start, end]}>
          {word}
        </ScrollRevealWord>
        {i < paragraphWords.length - 1 && " "}
      </span>
    );
  });}
</p>

// 4. Finally, individual characters animate from 80% to 100%
<a href="mailto:contact@example.com">
  {emailStr.split("").map((char, i) => {
    const rangeSize = 0.2;
    const start = 0.8 + (i / emailStr.length) * rangeSize;
    const end = 0.8 + ((i + 1) / emailStr.length) * rangeSize;
    return (
      <ScrollRevealWord key={i} progress={scrollYProgress} range={[start, end]}>
        {char}
      </ScrollRevealWord>
    );
  })}
</a>
```

## Summary Checklist for Perfection
1. **Spread the offset**: Make sure `useScroll` spans a large physical scroll distance (e.g., `["start 85%", "center 30%"]`) so a small swipe doesn't rush the animation.
2. **Hex to Hex Colors**: Always interpolate `colors={["#hex1", "#hex2"]}` instead of RGBA.
3. **Sequential Ranges**: Carefully map out the `0` to `1` range across your entire section top-to-bottom so everything flows naturally like a waterfall.
