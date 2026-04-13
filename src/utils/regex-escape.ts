export const regexEscape = (str?: string): string => {
   if (!str) return ''
   const unescaped = str.replace(/\\([.*+?^${}()|[\]\\])/g, '$1')
   return unescaped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
