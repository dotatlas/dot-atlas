import { PHOTOS } from '@/config/photos'

/**
 * The page's one rest: the material the work lives on, full bleed, between
 * the roles and the project. The measured results sit inside their roles.
 */
export function Figures() {
  const photo = PHOTOS.pcb
  return (
    <figure className="m-0 mt-(--section-gap)" data-reveal>
      <div className="overflow-hidden">
        <img
          src={photo.src}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading="lazy"
          className="photo slow-drift aspect-[4/3] w-full object-cover sm:aspect-[21/9]"
        />
      </div>
      <figcaption className="t-small mt-4 px-(--gutter) text-silk-2">{photo.caption}</figcaption>
    </figure>
  )
}
