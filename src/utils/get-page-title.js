import defaultSettings from '@/settings'

const title = defaultSettings.title || 'syin.icu'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title}`
  }
  return `${title}`
}
