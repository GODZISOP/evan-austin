# Animation Standards & Bug Fix Documentation

## The Issue: "Massive Empty Space" Bug
Previously, we attempted to build complex intro sequences using **Sticky Scroll-Scrubbing**. 
This involved making the section extremely tall (e.g., `h-[250vh]`), making the inner content `sticky top-0`, and using Framer Motion's `useScroll` to scrub the animation as the user scrolled down.

**Why this failed for this project:**
1. It created massive empty black spaces (the extra `150vh` of the container) that the user had to scroll past.
2. The animation would often trigger or finish while the section wasn't fully centered in the viewport, making it feel disconnected.
3. It disrupted the natural scroll flow of the website.

## The Fix: `useInView` Orchestration
To fix this permanently for the **Journey Section** and the **Gallery Section**, we completely abandoned the sticky `useScroll` method.

Instead, we use **Viewport-Triggered Entrance Animations**:
1. **Standard Height**: Sections are now strictly `h-screen` (or `h-auto`). We never use `250vh` or `sticky`.
2. **Detection**: We use Framer Motion's `useInView` hook (or `whileInView` prop) to detect when the section actually enters the screen.
3. **Orchestration**: 
   - When `isInView` becomes true, the animation starts automatically.
   - For complex sequences (like the Gallery intro fanning out into the interactive slider), we use a simple React `useEffect` with a `setTimeout` to swap states.
   - To make the animation replayable, we do NOT use `once: true`. Instead, we reset the state when the section leaves the viewport.
4. **Seamless Transitions**: We use `<AnimatePresence>` and `layoutId` to seamlessly morph the intro elements (like stacked cards) directly into their final interactive gallery positions without the user needing to scroll scrub.

### Rule for Future Sections
> **IMPORTANT**: Never use `useScroll` with a `h-[300vh]` sticky wrapper for section animations on this site again. Always use `useInView` on a standard `h-screen` container and let the animations play out automatically when the user reaches them.
