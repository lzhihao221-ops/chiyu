/**
 * 导出运动记录为CSV文件
 */
export function exportToCSV(records, exerciseTypes) {
  if (records.length === 0) {
    alert('没有可导出的记录')
    return
  }

  const typeMap = Object.fromEntries(exerciseTypes.map(t => [t.id, t]))

  // CSV 表头
  const headers = ['日期', '运动类型', '时长(分钟)', '备注']
  
  // 数据行
  const rows = records
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(r => {
      const typeInfo = typeMap[r.type] || { name: '未知' }
      return [
        r.date,
        typeInfo.name,
        r.duration,
        r.note || ''
      ]
    })

  // 生成 CSV 内容（带 BOM 支持中文 Excel 打开）
  const BOM = '\uFEFF'
  const csvContent = BOM + [
    headers.join(','),
    ...rows.map(row => row.map(cell => {
      const str = String(cell)
      // 如果包含逗号、换行或引号，用引号包裹
      if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }).join(','))
  ].join('\n')

  // 下载
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `吃鱼运动记录_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * 导出为JSON备份文件
 */
export function toJSON(records, exerciseTypes, userName) {
  if (records.length === 0) {
    alert('没有可导出的记录')
    return
  }

  const typeMap = Object.fromEntries(exerciseTypes.map(t => [t.id, t]))
  const exportData = {
    appName: '吃鱼',
    exportDate: new Date().toISOString(),
    userName,
    exerciseTypes: exerciseTypes.map(t => ({ id: t.id, name: t.name, icon: t.icon })),
    records: records.map(r => ({
      date: r.date,
      type: typeMap[r.type]?.name || r.type,
      duration: r.duration,
      note: r.note || '',
      created_at: r.created_at,
    })),
    summary: {
      totalRecords: records.length,
      totalDays: new Set(records.map(r => r.date)).size,
      totalMinutes: records.reduce((s, r) => s + r.duration, 0),
    }
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `吃鱼运动备份_${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
