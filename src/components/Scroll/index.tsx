import React, {
  forwardRef,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  ReactNode,
} from 'react'
import BScroll from '@better-scroll/core'
import MouseWheel from '@better-scroll/mouse-wheel'
import ScrollBar from '@better-scroll/scroll-bar'

BScroll.use(ScrollBar)
BScroll.use(MouseWheel)

export interface ScrollImperativeHandle {
  finishPullDown: Function
  getBScroll: Function
  refresh: Function
}

type ScrollProps = {
  children?: ReactNode
  direction?: 'vertical' | 'horizental'
  click?: boolean
  onScroll?: Function
  bounceTop?: boolean //是否支持向上吸顶
  bounceBottom?: boolean //是否支持向下吸顶
  stopPropagation?: boolean //是否阻止冒泡
  className?: string
  style?: React.CSSProperties
  data?: any // watch data to refresh Scroll
}

const Scroll = forwardRef<ScrollImperativeHandle, ScrollProps>((props, ref) => {
  const [bScroll, setBScroll] = useState<BScroll | null>()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Attribute props
  const {
    direction = 'vertical',
    click = true,
    bounceTop = true,
    bounceBottom = true,
    className,
    data,
    style,
    stopPropagation = true,
  } = props

  // Method props
  const { onScroll } = props

  // init BScroll
  useEffect(() => {
    if (bScroll) return
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const scroll = new BScroll(scrollRef.current!, {
      scrollX: direction === 'horizental',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom,
      },
      stopPropagation,
      mouseWheel: true,
      scrollbar: {
        interactive: true,
      },
    })
    setBScroll(scroll)
    return () => {
      setBScroll(null)
    }
    // eslint-disable-next-line
  }, [])

  // watch onScroll
  useEffect(() => {
    if (!bScroll || !onScroll) return
    bScroll.on('scroll', onScroll)
    return () => {
      bScroll.off('scroll', onScroll)
    }
  }, [onScroll, bScroll])

  // refresh BScroll
  useEffect(() => {
    if (bScroll) {
      bScroll.refresh()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScroll) {
        bScroll.refresh()
        bScroll.scrollTo(0, 0)
      }
    },
    getBScroll() {
      if (bScroll) {
        return bScroll
      }
    },
    finishPullDown() {
      if (bScroll) {
        // setBeforePullDown(false)
        bScroll.finishPullDown()
      }
    },
  }))

  return (
    <div
      style={{ ...style, overflow: 'hidden', position: 'relative' }}
      className={className}
      ref={scrollRef}
    >
      {props.children}
    </div>
  )
})

export default Scroll
