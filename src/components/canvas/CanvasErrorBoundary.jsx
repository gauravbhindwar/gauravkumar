'use client'

import { Component } from 'react'

/**
 * Catches WebGL context-creation failures (GPU-less environments, headless
 * browsers) so a canvas failure degrades to a static fallback instead of
 * crashing the section around it.
 */
export default class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.warn('3D canvas failed to render, falling back to static visual:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}
