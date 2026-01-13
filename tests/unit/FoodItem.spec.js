import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FoodItem from '@/components/FoodItem.vue'

describe('FoodItem.vue', () => {

    it('sollte ein "delete" Event senden, wenn der Lösch-Button geklickt wird', async () => {
        const food = { id: 123, name: 'Pizza', calories: 800 }
        const wrapper = mount(FoodItem, {
            props: { food }
        })

        const deleteBtn = wrapper.find('button')
        await deleteBtn.trigger('click')

        expect(wrapper.emitted()).toHaveProperty('delete')
        expect(wrapper.emitted().delete[0]).toEqual([123])
    })

    it('stellt Name und Kalorien des Lebensmittels korrekt dar', () => {
        const food = { name: 'Magerquark', calories: 68, protein: 12 }
        const wrapper = mount(FoodItem, { props: { food } })

        expect(wrapper.text()).toContain('Magerquark')
        expect(wrapper.text()).toContain('68 kcal')
    })

    it('zeigt Makronährstoffe nur an, wenn sie vorhanden sind', () => {
        const foodWithMacros = { name: 'Ei', calories: 155, protein: 13 }
        const wrapper = mount(FoodItem, { props: { food: foodWithMacros } })

        expect(wrapper.text()).toContain('13 P')
    })
})