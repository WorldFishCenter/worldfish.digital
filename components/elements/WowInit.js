'use client'
import { useEffect } from 'react'

export default function WowInit() {
    useEffect(() => {
        const initWow = async () => {
            const wowPkg = await import('wowjs')
            const WOW = wowPkg.WOW || wowPkg.default?.WOW || wowPkg.default
            if (WOW && typeof WOW === 'function') {
                new WOW().init()
            }
        }
        initWow().catch(err => console.warn('WOW.js init failed:', err))
    }, [])

    return null
}
