export const types = {
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
  doc: "application/msword",
  zip: "application/x-7z-compressed"
}
export function download(data, type, filename) {
  let blob = new Blob([data], { type: type })
  let tmp = document.createElement('a')
  tmp.download = filename
  tmp.style.display = 'none'
  tmp.href = URL.createObjectURL(blob)
  document.body.appendChild(tmp)
  tmp.click()
  URL.revokeObjectURL(tmp.href)
  document.body.removeChild(tmp)
}