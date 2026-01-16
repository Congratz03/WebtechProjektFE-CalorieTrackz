import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LoginView from '@/views/LoginView.vue'

// Mock für localStorage und Router
const mockRouterPush = vi.fn()
const mockSetItem = vi.fn()

Object.defineProperty(window, 'localStorage', {
    value: { setItem: mockSetItem }
})

describe('LoginView.vue', () => {
    global.fetch = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    // Test 1: Umschalten zwischen Login und Registrierung
    it('sollte zwischen Login und Registrierungs-Modus umschalten', async () => {
        const wrapper = mount(LoginView)

        // Standard ist Login
        expect(wrapper.text()).toContain('Willkommen zurück!')

        // Klick auf "Registrieren" Tab
        const registerTab = wrapper.findAll('button').at(1) // Der zweite Button im Header
        await registerTab.trigger('click')

        expect(wrapper.text()).toContain('Profil erstellen')
        expect(wrapper.vm.isRegistering).toBe(true)
    })

    // Test 2: Erfolgreicher Login
    it('sollte bei erfolgreichem Login den Token speichern und weiterleiten', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token: 'fake-jwt-token' })
        })

        const wrapper = mount(LoginView, {
            global: {
                mocks: { $router: { push: mockRouterPush } }
            }
        })

        // Formular ausfüllen
        await wrapper.find('input[type="text"]').setValue('testuser')
        await wrapper.find('input[type="password"]').setValue('password123')

        // Absenden
        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(mockSetItem).toHaveBeenCalledWith('jwt_token', 'fake-jwt-token')
        expect(mockRouterPush).toHaveBeenCalledWith('/tracker')
    })

    // Test 3: Fehleranzeige bei falschem Login
    it('sollte eine Fehlermeldung anzeigen, wenn der Login fehlschlägt', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 401
        })

        const wrapper = mount(LoginView)

        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.text()).toContain('Login fehlgeschlagen')
    })
})
