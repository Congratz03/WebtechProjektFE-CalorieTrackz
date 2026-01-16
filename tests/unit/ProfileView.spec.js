import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ProfileView from '@/views/ProfileView.vue'

describe('ProfileView.vue', () => {
    global.fetch = vi.fn()

    beforeEach(() => {
        fetch.mockClear()
        // Mock für initialen Load
        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({
                weight: 80, height: 180, age: 25,
                gender: 'MALE', activityLevel: 'LOW', goal: 'MAINTAIN_WEIGHT',
                targetCalories: 2500
            })
        })
    })

    // Test 4: Daten laden und anzeigen
    it('sollte Profildaten beim Start laden und in Inputs füllen', async () => {
        const wrapper = mount(ProfileView)
        await flushPromises()

        // Prüfen ob fetch aufgerufen wurde
        expect(fetch).toHaveBeenCalledTimes(1)

        // Prüfen ob Input Values stimmen (Vue Model Sync)
        const weightInput = wrapper.find('input[type="number"]') // Das erste Number Input ist Gewicht
        expect(weightInput.element.value).toBe('80')
    })

    // Test 5: BMI Berechnung Logik
    it('sollte den BMI basierend auf Gewicht und Größe korrekt berechnen', async () => {
        const wrapper = mount(ProfileView)
        await flushPromises()

        // Wir ändern die Daten manuell im State
        wrapper.vm.user.weight = 80
        wrapper.vm.user.height = 180 // 1.80m

        // BMI Formel: 80 / (1.8 * 1.8) = 24.69... -> ca 24.7
        expect(wrapper.vm.calculatedBMI).toBe('24.7')

        // Kategorie prüfen
        expect(wrapper.vm.getBMICategory.text).toBe('Normalgewicht')
    })
})
