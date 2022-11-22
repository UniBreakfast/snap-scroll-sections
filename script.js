const mainContainer = body.querySelector('main')
const sections = [...mainContainer.querySelectorAll('section')]

let minScrollDurationFlag, maxScrollDurationFlag, wheelScrollFlag
let scrollTimerId, maxScrollTimerId, wheelScrollTimerId
let up, prevScrollTop = 0

mainContainer.onscroll = e => {
  const { scrollTop } = mainContainer

  up = scrollTop < prevScrollTop
  prevScrollTop = scrollTop

  clearTimeout(scrollTimerId)

  scrollTimerId = setTimeout(handleScroll, 100, e)
}

mainContainer.onwheel = handleWheel

function handleWheel(e) {
  if (maxScrollDurationFlag || wheelScrollFlag) {
    e.preventDefault()
  }

  wheelScrollFlag = true
  
  clearTimeout(wheelScrollTimerId)
  wheelScrollTimerId = setTimeout(() => wheelScrollFlag = false, 2000)
}

function handleScroll() {
  if (minScrollDurationFlag) return

  minScrollDurationFlag = maxScrollDurationFlag = true

  const nextSection = getNextSection()

  scrollToSection(nextSection)

  setTimeout(() => minScrollDurationFlag = false, 1200)

  clearTimeout(maxScrollTimerId)
  maxScrollTimerId = setTimeout(() => maxScrollDurationFlag = false, 2000)
}

function getNextSection() {
  const mainRect = mainContainer.getBoundingClientRect()
  const mainTop = mainRect.top

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const sectionTop = section.getBoundingClientRect().top
    
    if (sectionTop >= mainTop) {
      return up ? sections[i - 1] : section
    }
  }
}

function scrollToSection(nextSection) {
  nextSection?.scrollIntoView({behavior: 'smooth'})
}

/* 
! Когда крутится колёсико
  ! не реагировать, если ещё может ползти
  ! запретить реагировать на колёсико на X мс

* Когда случилась перемотка
  * не реагировать если ещё может ползти
  * отменить запланированную реакцию
  * запланировать реакцию через Y мс

? Реагируя на перемотку
  ? пускай ползёт в нужном направлении
  ? cчитать, что ползёт
  ? отменить запланированную
  ? запланировать перестать считать, что ползёт через 50 мс
*/
