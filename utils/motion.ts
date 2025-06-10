export const greetingVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1.5,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      type: "spring",
      duration: 1.5,
    },
  },
};

export const textVariants = (direction?: string, delay?: number) => ({
  hidden: { 
    opacity: 0,
    x: direction === "right" ? 20 : direction === "left" ? -20 : 0,
    y: direction === "up" ? 20 : direction === "bottom" ? -20 : 0
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      duration: 1,
      delay
    },
  },
});

export const shopMarkerVariants = (delay?: number) => ({
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.4,
      delay
    },
  },
});

export const parentShopDetailVariants = (duration?: number) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration,
    },
  },
});

export const shopDetailVariants = (screen?: string | null) => ({
  hidden: {
    opacity: 0,
    scale: screen === "mobile" || screen === "tablet" ? 1 : 0.95,
    x: screen === "tablet" ? "-100%" : 0,
    y: screen === "mobile" ? "100%" : 0
  }, 
  show: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: screen === "mobile" || screen === "tablet" ? 1 : 0.95,
    x: screen === "tablet" ? "-100%" : 0,
    y: screen === "mobile" ? "100%" : 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
});