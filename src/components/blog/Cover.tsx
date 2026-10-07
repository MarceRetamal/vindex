// Portada de nota. Imagen decorativa (alt vacío): el título ya está en el texto.
// Usa <img> común para no depender de la optimización de imágenes de Next
// en Cloudflare; las portadas son livianas (SVG o WebP).
export function Cover({ src, className = '' }: { src: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={1200}
      height={630}
      loading="lazy"
      decoding="async"
      className={`aspect-[1200/630] w-full object-cover ${className}`}
    />
  )
}
