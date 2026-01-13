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

    it('sollte das Eingabefeld für den Namen aktualisieren', async () => {
        const wrapper = mount(TrackerView, {
            global: { stubs: ['router-link', 'FoodItem'] }
        })
        const input = wrapper.find('input[placeholder*="Name"]')
        await input.setValue('Apfel')
        expect(wrapper.vm.newEntry.name).toBe('Apfel')
    })

    it('sollte das Formular leeren, nachdem ein Eintrag erfolgreich gespeichert wurde', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([{ id: 99, name: 'Brokkoli', calories: 50, protein: 2 }])
        })

        const wrapper = mount(TrackerView, {
            global: { stubs: ['router-link', 'FoodItem'] }
        })

        await wrapper.find('input[placeholder*="Name"]').setValue('Brokkoli')
        await wrapper.find('input[type="number"]').setValue(50)

        await wrapper.find('form').trigger('submit.prevent')
        await flushPromises()

        expect(wrapper.vm.newEntry.name).toBe('')
    })
})