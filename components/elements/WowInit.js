'use client'
import { useEffect } from 'react'

export default function WowInit() {
    useEffect(() => {
        const initWow = async () => {
            const module = await import('wowjs')
            const WOW = module.WOW || module.default?.WOW || module.default
            if (WOW && typeof WOW === 'function') {
                new WOW().init()
            }
        }
        initWow().catch(err => console.warn('WOW.js init failed:', err))
    }, [])

    return null
}
