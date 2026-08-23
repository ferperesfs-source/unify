import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const ink = 0x05070a
const bone = 0xdfe7e0
const vermilion = 0xe0231c
const gold = 0xc9a24a

export function KageWorld() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
    } catch {
      return undefined
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor(ink, 1)
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(ink)
    scene.fog = new THREE.FogExp2(ink, 0.048)
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80)
    camera.position.set(-1.4, 1.5, 11)

    scene.add(new THREE.HemisphereLight(bone, ink, 1.05))
    const keyLight = new THREE.DirectionalLight(vermilion, 5.2)
    keyLight.position.set(5, 7, 6)
    scene.add(keyLight)
    const warmLight = new THREE.PointLight(gold, 34, 15, 2)
    warmLight.position.set(0, 0.7, 2.2)
    scene.add(warmLight)

    const world = new THREE.Group()
    world.position.set(1.8, -1.2, -1)
    scene.add(world)

    const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x11171b, roughness: 0.78, metalness: 0.08 })
    const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0x35100f, roughness: 0.64, metalness: 0.12 })
    const windowMaterial = new THREE.MeshStandardMaterial({ color: gold, emissive: gold, emissiveIntensity: 2.4, roughness: 0.5 })

    for (let step = 0; step < 7; step += 1) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(7.5 - step * 0.52, 0.16, 1.05), darkMaterial)
      mesh.position.set(0, step * 0.2 - 1.25, step * -0.52 + 2.1)
      world.add(mesh)
    }

    const hall = new THREE.Group()
    const base = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.35, 3), darkMaterial)
    base.position.y = 0
    hall.add(base)
    ;[-2.25, -1.12, 0, 1.12, 2.25].forEach(x => {
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.25, 0.16), edgeMaterial)
      pillar.position.set(x, 1.05, 0.72)
      hall.add(pillar)
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.7, 0.05), windowMaterial)
      panel.position.set(x, 1.15, 0.83)
      hall.add(panel)
    })
    const roofLower = new THREE.Mesh(new THREE.BoxGeometry(7.1, 0.3, 3.7), darkMaterial)
    roofLower.position.set(0, 2.28, 0)
    roofLower.rotation.z = -0.025
    hall.add(roofLower)
    const roofUpper = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.42, 2.6), edgeMaterial)
    roofUpper.position.set(0, 2.72, -0.08)
    hall.add(roofUpper)
    world.add(hall)

    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(2.35, 48, 32),
      new THREE.MeshBasicMaterial({ color: vermilion, transparent: true, opacity: 0.72 })
    )
    moon.position.set(3.15, 3.15, -4.8)
    scene.add(moon)

    const grid = new THREE.GridHelper(42, 42, 0x293137, 0x151b1f)
    grid.position.y = -2.48
    grid.position.z = -4
    scene.add(grid)

    const particleCount = 520
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const boneColor = new THREE.Color(bone)
    const redColor = new THREE.Color(vermilion)
    for (let index = 0; index < particleCount; index += 1) {
      const offset = index * 3
      positions[offset] = (Math.random() - 0.5) * 25
      positions[offset + 1] = Math.random() * 10 - 3
      positions[offset + 2] = Math.random() * 15 - 9
      const color = index % 7 === 0 ? redColor : boneColor
      colors[offset] = color.r; colors[offset + 1] = color.g; colors[offset + 2] = color.b
    }
    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const particles = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({ size: 0.035, transparent: true, opacity: 0.48, vertexColors: true }))
    scene.add(particles)

    const pointer = { x: 0, y: 0 }
    let scrollProgress = 0
    let targetScroll = 0
    let frameId = 0
    let visible = true

    const resize = () => {
      const width = Math.max(window.innerWidth, 1)
      const height = Math.max(window.innerHeight, 1)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    const updateScroll = () => {
      const total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      targetScroll = Math.min(window.scrollY / total, 1)
    }
    const updatePointer = event => {
      pointer.x = event.clientX / Math.max(window.innerWidth, 1) - 0.5
      pointer.y = event.clientY / Math.max(window.innerHeight, 1) - 0.5
    }
    const render = time => {
      if (!visible) return
      scrollProgress += (targetScroll - scrollProgress) * (reducedMotion ? 1 : 0.045)
      const drift = reducedMotion ? 0 : Math.sin(time * 0.00016) * 0.08
      camera.position.x = -1.4 + scrollProgress * 3.25 + pointer.x * 0.42
      camera.position.y = 1.5 + Math.sin(scrollProgress * Math.PI * 2) * 0.56 - pointer.y * 0.24
      camera.position.z = 11 - scrollProgress * 3.8
      camera.lookAt(0.55 + scrollProgress * 0.9, 0.35 + drift, -0.8)
      moon.position.y = 3.15 - scrollProgress * 1.3
      particles.rotation.y = time * 0.000018
      world.rotation.y = -0.08 + scrollProgress * 0.19
      renderer.render(scene, camera)
      if (!reducedMotion) frameId = requestAnimationFrame(render)
    }
    const onVisibility = () => {
      visible = !document.hidden
      if (visible && !reducedMotion) { cancelAnimationFrame(frameId); frameId = requestAnimationFrame(render) }
      else cancelAnimationFrame(frameId)
    }

    resize(); updateScroll(); render(0)
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('pointermove', updatePointer, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('pointermove', updatePointer)
      document.removeEventListener('visibilitychange', onVisibility)
      particlesGeometry.dispose()
      particles.material.dispose()
      scene.traverse(object => {
        if (object.geometry && object.geometry !== particlesGeometry) object.geometry.dispose()
        if (object.material && object.material !== particles.material) object.material.dispose()
      })
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="kage-world" aria-hidden="true" />
}
