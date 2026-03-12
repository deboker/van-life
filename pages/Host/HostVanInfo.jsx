import React from "react"
import { useOutletContext } from "react-router-dom"

export default function HostVanInfo() {
    const { currentVan } = useOutletContext()
    
    return (
        <section className="host-van-detail-info">
            <h4>Názov: <span>{currentVan.name}</span></h4>
            <h4>Kategória: <span>{currentVan.type}</span></h4>
            <h4>Popis: <span>{currentVan.description}</span></h4>
            <h4>Viditeľnosť: <span>Verejná</span></h4>
        </section>
    )
}
