import { InvalidLatitudeError } from '../error/invalid-latitude-error'
import { InvalidLongitudeError } from '../error/invalid-longitude-error'
import { Coordinate } from './coordinate'

describe('Coordinate', () => {
  test('Deve criar uma coordenada', () => {
    const input = { latitude: -23.5505, longitude: -46.6333 }
    const coord = Coordinate.create(input).forceRight().value
    expect(coord).toBeDefined()
    expect(coord.latitude).toBe(input.latitude)
    expect(coord.longitude).toBe(input.longitude)
  })

  test('Deve restaurar uma coordenada', () => {
    const input = { latitude: -23.5505, longitude: -46.6333 }
    const coord = Coordinate.restore(input)
    expect(coord).toBeDefined()
    expect(coord.latitude).toBe(input.latitude)
    expect(coord.longitude).toBe(input.longitude)
  })

  test('Deve retornar erro para latitude inválida', () => {
    const input = { latitude: -100, longitude: -46.6333 }
    const result = Coordinate.create(input)
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidLatitudeError)
  })

  test('Deve retornar erro para longitude inválida', () => {
    const input = { latitude: -23.5505, longitude: -200 }
    const result = Coordinate.create(input)
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidLongitudeError)
  })

  test('Deve retornar erro para latitude e longitude inválidas', () => {
    const input = { latitude: -100, longitude: -200 }
    const result = Coordinate.create(input)
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidLatitudeError)
  })
})