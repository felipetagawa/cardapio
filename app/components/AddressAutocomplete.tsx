"use client"

import { useLoadScript, Autocomplete } from "@react-google-maps/api"
import { useState, useRef } from "react"

const libraries: ("places")[] = ["places"]

interface AddressAutocompleteProps {
    value: string
    onChange: (address: string) => void
    placeholder?: string
    className?: string
}

export default function AddressAutocomplete({
    value,
    onChange,
    placeholder = "Digite o endereço",
    className = ""
}: AddressAutocompleteProps) {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries,
    })

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete
    }

    const onPlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace()
            if (place.formatted_address) {
                onChange(place.formatted_address)
            }
        }
    }

    if (loadError) {
        return (
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={className}
            />
        )
    }

    if (!isLoaded) {
        return (
            <input
                type="text"
                disabled
                placeholder="Carregando..."
                className={className}
            />
        )
    }

    return (
        <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            options={{
                componentRestrictions: { country: "br" },
                fields: ["formatted_address", "address_components"],
                types: ["address"],
                // Restrict to José Bonifácio area
                bounds: {
                    north: -21.03,
                    south: -21.08,
                    east: -49.68,
                    west: -49.73,
                },
                strictBounds: false,
            }}
        >
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={className}
            />
        </Autocomplete>
    )
}
