'use client'

export function HotelSortSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <select
      className="h-9 px-3 rounded-xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
      defaultValue={defaultValue}
      onChange={(e) => {
        const url = new URL(window.location.href)
        url.searchParams.set('sortBy', e.target.value)
        window.location.href = url.toString()
      }}
      aria-label="Sort hotels"
    >
      <option value="rating_desc">Top Rated</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="name_asc">Name A–Z</option>
    </select>
  )
}
