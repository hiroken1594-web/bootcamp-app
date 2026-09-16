async function request(path, options) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `リクエストに失敗しました (${res.status})`)
  }
  return res.json()
}

export function fetchProfile(name) {
  return request(`/api/profile?name=${encodeURIComponent(name)}`)
}

export function saveProfile(profile) {
  return request('/api/profile', {
    method: 'POST',
    body: JSON.stringify(profile),
  })
}

export function fetchRecords(name) {
  return request(`/api/records?name=${encodeURIComponent(name)}`)
}

export function saveRecord(record) {
  return request('/api/records', {
    method: 'POST',
    body: JSON.stringify(record),
  })
}
