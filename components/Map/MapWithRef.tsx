import dynamic from "next/dynamic"; 

// Dynamic import of Map with `forwardRef` support
const MapWithRef = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => null,
}) as unknown as React.ForwardRefExoticComponent<any>;

export default MapWithRef;