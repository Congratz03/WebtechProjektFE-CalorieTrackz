import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import AnalyseView from '@/views/AnalyseView.vue'

describe('AnalyseView.vue', () => {
    global.fetch = vi.fn()

    beforeEach(() => {
        fetch.mockClear()
    })

    it('sollte die Analyse-Daten anzeigen, wenn die API antwortet', async () => {
        const mockUser = { goal: 'LOSE_WEIGHT', targetCalories: 2000, currentWeight: 80 }
        const mockFoods = [
            { id: 1, name: 'Pasta', calories: 500, protein: 20, carbohydrates: 60, fat: 10, date: new Date().toISOString().split('T')[0] }
        ]

        fetch
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockUser) })
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockFoods) })

        const wrapper = mount(AnalyseView, {
            global: {
                stubs: ['router-link', 'Bar', 'Doughnut']
            }
        })

        await flushPromises()

        const text = wrapper.text()
        expect(text).not.toContain('Synchronisiere mit Datenbank...')
        expect(text).toContain('Deine Analyse')
        expect(text).toContain('500 kcal')
        expect(text).toContain('Pasta')
    })

    it('sollte eine Nachricht anzeigen, wenn keine Daten vom Backend kommen', async () => {
        fetch
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ goal: 'LOSE_WEIGHT' }) })
            .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })

        const wrapper = mount(AnalyseView, {
            global: { stubs: ['router-link', 'Bar', 'Doughnut'] }
        })

        await flushPromises()

        expect(wrapper.text()).toContain('Noch keine Daten für eine Analyse vorhanden.')
    })

    it('sollte den Ladezustand beenden, auch wenn die API einen Fehler wirft', async () => {
        fetch.mockRejectedValueOnce(new Error('API Down'))

        const wrapper = mount(AnalyseView, {
            global: { stubs: ['router-link', 'Bar', 'Doughnut'] }
        })

        await flushPromises()

        expect(wrapper.find('.animate-spin').exists()).toBe(false)
    })


    // Test 6: Berechnung der KPIs im Frontend
    it('sollte die durchschnittlichen Kalorien korrekt berechnen', async () => {
        // Mock User
        fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ targetCalories: 2000 }) })

        // Mock 2 Tage mit Essen
        const mockFoods = [
            { date: '2023-01-01', calories: 2000 },
            { date: '2023-01-02', calories: 1000 }
        ]
        // Summe = 3000, Tage = 2 -> Durchschnitt = 1500

        fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockFoods) })

        const wrapper = mount(AnalyseView, {
            global: { stubs: ['router-link', 'Chart', 'Doughnut'] }
        })
        await flushPromises()

        expect(wrapper.vm.averageDailyCalories).toBe("1500")
        expect(wrapper.vm.uniqueDaysCount).toBe(2)
    })

})