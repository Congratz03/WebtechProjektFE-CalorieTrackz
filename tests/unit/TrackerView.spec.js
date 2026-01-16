import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TrackerView from '@/views/TrackerView.vue'

describe('TrackerView.vue', () => {
    global.fetch = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve([])
        })
    })

    // TEST 1
    it('sollte das Eingabefeld für den Namen aktualisieren', async () => {
        const wrapper = mount(TrackerView, {
            global: { stubs: ['router-link', 'FoodItem'] }
        })
        // Warten auf mounted
        await flushPromises()

        const input = wrapper.find('input[placeholder*="Name"]')
        await input.setValue('Apfel')
        expect(wrapper.vm.newEntry.name).toBe('Apfel')
    })

    // TEST 2
    it('sollte das Formular leeren, nachdem ein Eintrag erfolgreich gespeichert wurde', async () => {
        const wrapper = mount(TrackerView, {
            global: { stubs: ['router-link', 'FoodItem'] }
        })
        await flushPromises()

        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ id: 99, name: 'Brokkoli', calories: 50, protein: 2 })
        })

        await wrapper.find('input[placeholder*="Name"]').setValue('Brokkoli')
        await wrapper.findAll('input[type="number"]')[0].setValue(50)

        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.vm.newEntry.name).toBe('')
    })

    // TEST 3 (Pflichtfelder / Leerer Test)
    it('sollte das Speichern verhindern, wenn Pflichtfelder fehlen', async () => {
        const wrapper = mount(TrackerView, {
            global: { stubs: ['router-link', 'FoodItem'] }
        })
        await flushPromises()

        fetch.mockClear()

        wrapper.vm.newEntry = { name: '', calories: null }


    })

    // TEST 4 (Suche)
    it('sollte die Suche ausführen, wenn mehr als 2 Zeichen eingegeben werden', async () => {
        // Initiale Mocks sind im beforeEach

        const wrapper = mount(TrackerView, { global: { stubs: ['router-link', 'FoodItem'] } })
        await flushPromises()

        // Mock Reset nach mounted
        fetch.mockClear()

        // Test A: Zu kurz
        wrapper.vm.searchQuery = 'Ap'
        await wrapper.vm.searchFood()
        expect(fetch).not.toHaveBeenCalled()

        // Test B: Lang genug
        wrapper.vm.searchQuery = 'Apfel'
        await wrapper.vm.searchFood()
        expect(fetch).toHaveBeenCalled()
    })

    // TEST 5 (Löschen)
    it('sollte einen Eintrag aus der Liste entfernen, wenn delete Event kommt', async () => {
        // Daten laden simulieren
        fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([{ id: 1, name: 'Brot', calories: 100 }]) })

        const wrapper = mount(TrackerView, { global: { stubs: ['router-link', 'FoodItem'] } })
        await flushPromises()

        // Mock Delete
        fetch.mockResolvedValueOnce({ ok: true })
        // Mock Reload
        fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) })

        window.confirm = vi.fn(() => true)

        await wrapper.vm.deleteFoodEntry(1)

        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/1'), expect.objectContaining({ method: 'DELETE' }))
    })

})
