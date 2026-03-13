import React from "react"
import { useOutletContext } from "react-router-dom"

export default function HostVanPhotos() {
    const { currentVan } = useOutletContext()
    const images = [currentVan.imageUrl, ...(currentVan.gallery || [])].filter(Boolean)
    return (
        <div className="host-van-photos-grid">
            {images.map((src, idx) => (
                <img
                    key={src + idx}
                    src={src}
                    alt={`${currentVan.name} ${idx + 1}`}
                    className="host-van-detail-image"
                />
            ))}
        </div>
    )
}
