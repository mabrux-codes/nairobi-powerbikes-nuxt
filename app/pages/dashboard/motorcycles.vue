<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <!-- Header -->
    <motion.div :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4 }" class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <span class="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-[10px] font-display tracking-[0.25em] text-brand-red uppercase">
          <span class="h-1.5 w-1.5 rounded-full bg-brand-red animate-pulse" />
          Inventory
        </span>
        <h1 class="mt-3 font-heading text-3xl sm:text-4xl text-white">Motorcycle <span class="text-brand-red">Inventory</span></h1>
        <p class="mt-1 text-sm text-brand-grey">Manage your fleet — updates are live</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-brand-grey/70">Updated {{ store.lastUpdated }}</span>
        <RealtimeStatus />
        <Button size="sm" @click="openCreateModal">
          <Plus class="h-4 w-4" />Add Motorcycle
        </Button>
      </div>
    </motion.div>

    <!-- Inventory summary (live) -->
    <div>
      <div class="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <div v-for="card in inventoryStats" :key="card.label" class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 flex items-center gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" :class="card.iconBg">
            <component :is="card.icon" class="h-5 w-5" :class="card.iconColor" />
          </span>
          <div class="min-w-0">
            <p class="font-heading text-2xl text-white">{{ card.value }}</p>
            <p class="truncate text-[11px] font-display tracking-wider text-brand-grey uppercase">{{ card.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <div v-for="card in stats" :key="card.label" class="group relative overflow-hidden rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-red/40">
        <span v-if="card.dot" class="absolute top-0 left-0 h-0.5 w-0 bg-brand-red transition-all duration-300 group-hover:w-full" />
        <div class="flex items-center justify-between">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg" :class="card.iconBg">
            <component :is="card.icon" class="h-5 w-5" :class="card.iconColor" />
          </span>
          <span class="font-heading text-2xl text-white">{{ card.value }}</span>
        </div>
        <p class="mt-3 font-display text-xs tracking-display text-brand-grey uppercase">{{ card.label }}</p>
      </div>
    </div>

    <!-- Filters -->
    <motion.div :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.08, duration: 0.4 }" class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-[200px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-grey/50" />
        <input v-model="searchQuery" type="text" placeholder="Search name, brand, engine…" class="w-full h-9 pl-9 pr-3 text-sm text-white bg-white/[0.04] border border-brand-grey/15 rounded-lg placeholder:text-brand-grey/50 focus:outline-none focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/20 transition-all" />
      </div>
      <select v-model="brandFilter" class="h-9 text-sm bg-brand-black/60 border border-brand-grey/15 rounded-lg text-white px-3 focus:outline-none focus:border-brand-red/60">
        <option value="">All Brands</option>
        <option v-for="b in store.brands" :key="b.id" :value="b.id">{{ b.name }}</option>
      </select>
      <select v-model="typeFilter" class="h-9 text-sm bg-brand-black/60 border border-brand-grey/15 rounded-lg text-white px-3 focus:outline-none focus:border-brand-red/60">
        <option value="">All Types</option>
        <option v-for="t in bikeTypes" :key="t" :value="t">{{ t }}</option>
      </select>
      <select v-model="statusFilter" class="h-9 text-sm bg-brand-black/60 border border-brand-grey/15 rounded-lg text-white px-3 focus:outline-none focus:border-brand-red/60">
        <option value="">All Status</option>
        <option value="available">Available</option>
        <option value="sold">Sold</option>
        <option value="coming_soon">Coming Soon</option>
      </select>
      <select v-model="stockFilter" class="h-9 text-sm bg-brand-black/60 border border-brand-grey/15 rounded-lg text-white px-3 focus:outline-none focus:border-brand-red/60" aria-label="Filter by stock level">
        <option value="">All Stock</option>
        <option value="in_stock">In Stock</option>
        <option value="few_remaining">Few Remaining</option>
        <option value="low_stock">Low Stock</option>
        <option value="out_of_stock">Out of Stock</option>
      </select>
      <button class="h-9 px-3 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5" :class="featuredOnly ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'text-brand-grey hover:text-white hover:bg-white/5'" @click="featuredOnly = !featuredOnly">
        <Star class="h-3.5 w-3.5" :class="featuredOnly ? 'fill-amber-400' : ''" />Featured
      </button>
      <div class="flex items-center rounded-lg border border-brand-grey/15 p-0.5">
        <button class="h-8 px-3 text-xs font-semibold rounded-md transition-colors" :class="view === 'grid' ? 'bg-brand-red text-white' : 'text-brand-grey hover:text-white'" @click="view = 'grid'"><LayoutGrid class="h-3.5 w-3.5 inline mr-1" />Grid</button>
        <button class="h-8 px-3 text-xs font-semibold rounded-md transition-colors" :class="view === 'table' ? 'bg-brand-red text-white' : 'text-brand-grey hover:text-white'" @click="view = 'table'"><List class="h-3.5 w-3.5 inline mr-1" />Table</button>
      </div>
      <button v-if="hasFilters || selectedIds.size > 0" class="h-9 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 rounded-lg transition-colors" @click="resetFilters">
        Clear <X class="h-3.5 w-3.5 inline -ml-0.5" />
      </button>
    </motion.div>

    <!-- Bulk bar -->
    <div v-if="selectedIds.size > 0" class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-3">
      <p class="text-sm text-white"><span class="font-semibold text-brand-red">{{ selectedIds.size }}</span> selected</p>
      <div class="flex flex-wrap gap-2">
        <Button size="sm" variant="ghost" class="h-11 sm:h-9" @click="exportCsv">Export CSV</Button>
        <Button size="sm" variant="danger" class="h-11 sm:h-9" :disabled="deleting" @click="bulkDelete">{{ deleting ? 'Deleting…' : 'Delete Selected' }}</Button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="!store.ready" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 6" :key="i" class="animate-pulse rounded-xl border border-brand-grey/15 bg-brand-black/60 p-4">
        <div class="mb-3 aspect-video rounded-lg bg-brand-grey/10" />
        <div class="h-5 w-3/4 rounded bg-brand-grey/10" />
        <div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10" />
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0" class="rounded-2xl border border-dashed border-brand-grey/20 bg-brand-black/40 p-14 text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-red/10">
        <Bike class="h-8 w-8 text-brand-red/60" />
      </div>
      <p class="font-display text-xl tracking-display text-brand-grey">No motorcycles found</p>
      <p class="mt-2 text-sm text-brand-grey/60">Add your first bike to the inventory — it appears here instantly.</p>
    </div>

    <!-- Grid view -->
    <div v-else-if="view === 'grid'" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <TransitionGroup name="list">
        <motion.div
          v-for="m in paginated"
          :key="m.id"
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.35 }"
          class="group relative overflow-hidden rounded-xl border border-brand-grey/15 bg-brand-black/80 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-lg hover:shadow-brand-red/5"
        >
          <span class="absolute top-0 left-0 h-0.5 w-0 bg-brand-red transition-all duration-300 group-hover:w-full" />
          <button
            class="absolute top-3 left-3 z-10 flex h-7 w-7 items-center justify-center rounded-lg border transition-all"
            :class="selectedIds.has(m.id) ? 'bg-brand-red border-brand-red text-white' : 'border-brand-grey/25 bg-brand-black/70 text-brand-grey hover:text-white'"
            @click.stop="toggleSelect(m.id)"
            :aria-label="selectedIds.has(m.id) ? 'Deselect' : 'Select'"
          >
            <Check class="h-3.5 w-3.5" :class="selectedIds.has(m.id) ? '' : 'opacity-0'" />
          </button>
          <NuxtLink v-if="m.slug" :to="`/motorcycles/${m.slug}`" class="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-lg border border-brand-grey/25 bg-brand-black/70 text-brand-grey hover:text-white hover:border-brand-red/50 transition-all" title="View on site">
            <ExternalLink class="h-3.5 w-3.5" />
          </NuxtLink>

          <div class="relative mb-3 flex aspect-video items-center justify-center overflow-hidden bg-brand-grey/10">
            <img v-if="m.images?.length" :src="filesUrl(m, m.images[0])" :alt="m.name" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <Bike v-else class="h-10 w-10 text-brand-grey/30" />
            <span v-if="m.featured" class="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-display tracking-wider text-black font-bold"><Star class="h-3 w-3 fill-black" />Featured</span>
            <span v-if="m.sale_price" class="absolute bottom-2 left-2 rounded-full bg-brand-red px-2 py-0.5 text-[9px] font-bold text-white">SALE</span>
          </div>

          <div class="p-4 pt-0">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="text-[10px] font-display tracking-[0.2em] text-brand-grey/70 uppercase">{{ brandName(m.brand) }}</p>
                <h3 class="font-display text-lg tracking-display text-white truncate">{{ m.name }}</h3>
              </div>
              <StatusChip :status="m.status || 'available'" size="sm" />
            </div>
            <p class="mt-1 text-xs text-brand-grey">{{ m.year || '—' }} · {{ m.engine_cc || '—' }}cc · {{ m.type || 'Street' }}</p>
            <div class="mt-3 flex items-end justify-between gap-2">
              <div>
                <p v-if="m.sale_price" class="text-sm font-semibold text-brand-red">KSh {{ formatPrice(m.sale_price) }}</p>
                <p class="text-lg font-bold" :class="m.sale_price ? 'text-brand-grey line-through decoration-brand-grey/50 text-sm' : 'text-brand-red'">KSh {{ formatPrice(m.price) }}</p>
              </div>
              <StatusChip :status="stockChip(m)" size="sm" />
            </div>
            <div class="mt-3 flex items-center justify-between gap-2 rounded-lg border border-brand-grey/15 bg-white/[0.02] px-3 py-2">
              <span class="text-xs text-brand-grey">Stock</span>
              <div class="flex items-center gap-1">
                <button class="flex h-7 w-7 items-center justify-center rounded-md border border-brand-grey/20 text-brand-grey hover:text-white hover:border-brand-red/50 transition-colors" :aria-label="`Decrease stock for ${m.name}`" @click="quickStock(m, -1)"><Minus class="h-3.5 w-3.5" /></button>
                <button class="min-w-9 px-1 text-center font-display text-sm font-bold text-white hover:text-brand-red transition-colors" :title="`${m.name} — ${stockQty(m)} in stock. Click to set exact value.`" @click="openStockEditor(m)">{{ stockQty(m) }}</button>
                <button class="flex h-7 w-7 items-center justify-center rounded-md border border-brand-grey/20 text-brand-grey hover:text-white hover:border-brand-red/50 transition-colors" :aria-label="`Increase stock for ${m.name}`" @click="quickStock(m, 1)"><Plus class="h-3.5 w-3.5" /></button>
              </div>
              <button class="text-xs font-semibold text-brand-grey hover:text-brand-red transition-colors" @click="openStockEditor(m)">Update</button>
            </div>
            <button class="mt-2 inline-flex items-center gap-1 text-[11px] text-brand-grey hover:text-brand-red transition-colors" :aria-label="`View customers waiting for ${m.name}`" @click="openReminders(m)">
              <BellRing class="h-3.5 w-3.5" />Waiting: {{ waitingCount(m.id) }}
            </button>
            <div class="mt-4 grid grid-cols-2 gap-2">
              <Button variant="ghost" size="sm" @click="openEditModal(m)">Edit</Button>
              <Button variant="danger" size="sm" :disabled="deleting" @click="confirmDelete(m)">Delete</Button>
            </div>
          </div>
        </motion.div>
      </TransitionGroup>
    </div>

    <!-- Table view -->
    <motion.div v-else :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.12, duration: 0.4 }" class="rounded-xl border border-brand-grey/15 bg-brand-black/80 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-brand-black/60 border-b border-brand-grey/15">
            <tr>
              <th class="sticky top-0 px-4 py-3.5 bg-brand-black/95">
                <input type="checkbox" class="accent-brand-red" :checked="pageAllSelected" @change="togglePage" />
              </th>
              <th class="sticky top-0 px-4 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95 cursor-pointer select-none hover:text-white" @click="setSort('name')">Bike <span v-if="sortKey === 'name'" class="text-brand-red">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></th>
              <th class="sticky top-0 px-4 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95 cursor-pointer select-none hover:text-white" @click="setSort('price')">Price <span v-if="sortKey === 'price'" class="text-brand-red">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></th>
              <th class="sticky top-0 px-4 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95 cursor-pointer select-none hover:text-white" @click="setSort('year')">Year <span v-if="sortKey === 'year'" class="text-brand-red">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></th>
              <th class="sticky top-0 px-4 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95">Engine</th>
              <th class="sticky top-0 px-4 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95">Status</th>
              <th class="sticky top-0 px-4 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95">Stock</th>
              <th class="sticky top-0 px-4 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-grey/10">
            <tr v-for="m in paginated" :key="m.id" class="transition-colors hover:bg-white/[0.03]">
              <td class="px-4 py-3">
                <input type="checkbox" class="accent-brand-red" :checked="selectedIds.has(m.id)" @change="toggleSelect(m.id)" />
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="h-10 w-14 rounded-lg overflow-hidden bg-brand-grey/10 shrink-0 flex items-center justify-center">
                    <img v-if="m.images?.length" :src="filesUrl(m, m.images[0])" :alt="m.name" class="h-full w-full object-cover" />
                    <Bike v-else class="h-4 w-4 text-brand-grey/30" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-white truncate">{{ m.name }}</p>
                    <p class="text-xs text-brand-grey truncate">{{ brandName(m.brand) }} · {{ m.type || 'Street' }}</p>
                  </div>
                  <Star v-if="m.featured" class="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />
                </div>
              </td>
              <td class="px-4 py-3">
                <p class="text-sm font-semibold" :class="m.sale_price ? 'text-brand-red' : 'text-white'">KSh {{ formatPrice(m.sale_price || m.price) }}</p>
              </td>
              <td class="px-4 py-3 text-brand-grey">{{ m.year || '—' }}</td>
              <td class="px-4 py-3 text-brand-grey">{{ m.engine_cc || '—' }}cc</td>
              <td class="px-4 py-3"><StatusChip :status="m.status || 'available'" size="sm" /></td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center gap-1">
                  <button class="p-1 text-brand-grey hover:text-white hover:bg-white/5 rounded transition-colors" :aria-label="`Decrease stock for ${m.name}`" @click="quickStock(m, -1)"><Minus class="h-3.5 w-3.5" /></button>
                  <button class="min-w-9 px-1 text-center text-sm font-bold text-white hover:text-brand-red transition-colors" :title="`Set exact stock for ${m.name}`" @click="openStockEditor(m)">{{ stockQty(m) }}</button>
                  <button class="p-1 text-brand-grey hover:text-white hover:bg-white/5 rounded transition-colors" :aria-label="`Increase stock for ${m.name}`" @click="quickStock(m, 1)"><Plus class="h-3.5 w-3.5" /></button>
                  <StatusChip :status="stockChip(m)" size="sm" class="ml-1.5" />
                </div>
                <button class="mt-1.5 inline-flex items-center gap-1 text-[11px] text-brand-grey hover:text-brand-red transition-colors" @click="openReminders(m)"><BellRing class="h-3 w-3" />Waiting: {{ waitingCount(m.id) }}</button>
              </td>
              <td class="px-4 py-3 text-right whitespace-nowrap">
                <button class="p-1.5 text-brand-grey hover:text-white hover:bg-white/5 rounded-md transition-colors" title="Edit" @click="openEditModal(m)"><Pencil class="h-4 w-4" /></button>
                <button class="p-1.5 text-rose-400 hover:text-white hover:bg-rose-500/15 rounded-md transition-colors" title="Delete" @click="confirmDelete(m)"><Trash2 class="h-4 w-4" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-brand-grey/15 px-5 py-3">
        <div class="flex flex-wrap items-center gap-3">
          <p class="text-xs text-brand-grey">Showing <span class="text-white font-semibold">{{ pageStart + 1 }}–{{ pageEnd }}</span> of <span class="text-white font-semibold">{{ filtered.length }}</span></p>
          <button class="text-xs font-semibold text-brand-grey hover:text-brand-red transition-colors" @click="exportCsv">Export CSV</button>
        </div>
        <div class="flex items-center gap-2">
          <button :disabled="page === 1" class="h-8 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg transition-colors" @click="page--">Prev</button>
          <button :disabled="page >= totalPages" class="h-8 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg transition-colors" @click="page++">Next</button>
        </div>
      </div>
    </motion.div>

    <!-- Pagination (grid) -->
    <div v-if="view === 'grid' && filtered.length > 0" class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-xs text-brand-grey">Showing <span class="text-white font-semibold">{{ pageStart + 1 }}–{{ pageEnd }}</span> of <span class="text-white font-semibold">{{ filtered.length }}</span></p>
      <div class="flex items-center gap-2">
        <button :disabled="page === 1" class="h-8 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg transition-colors" @click="page--">Prev</button>
        <button :disabled="page >= totalPages" class="h-8 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg transition-colors" @click="page++">Next</button>
      </div>
    </div>

    <!-- Create/Edit drawer -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="showModal" class="fixed inset-0 z-[70]">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal" />
          <div class="absolute right-0 top-0 h-full w-full max-w-2xl bg-brand-black border-l border-brand-grey/20 shadow-2xl shadow-black/60 flex flex-col">
            <div class="flex items-center justify-between border-b border-brand-grey/15 px-6 py-4 shrink-0">
              <h2 class="font-display text-lg tracking-display text-white">{{ editingId ? 'Edit Motorcycle' : 'Add Motorcycle' }}</h2>
              <button class="p-2 text-brand-grey hover:text-white hover:bg-white/5 rounded-lg transition-colors" @click="closeModal" aria-label="Close"><X class="h-5 w-5" /></button>
            </div>
            <div class="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Name *</label>
                  <Input v-model="form.name" placeholder="e.g. Ninja ZX-6R" />
                </div>
                <Input v-model="form.slug" label="Slug" placeholder="ninja-zx-6r" />
                <div>
                  <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Brand</label>
                  <select v-model="form.brand" class="input-field w-full"><option value="">Select brand</option><option v-for="b in store.brands" :key="b.id" :value="b.id">{{ b.name }}</option></select>
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Category</label>
                  <select v-model="form.category" class="input-field w-full"><option value="">Select category</option><option v-for="c in store.categories" :key="c.id" :value="c.id">{{ c.name }}</option></select>
                </div>
                <div>
                  <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Type</label>
                  <select v-model="form.type" class="input-field w-full"><option value="">Select type</option><option v-for="t in bikeTypes" :key="t" :value="t">{{ t }}</option></select>
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input v-model="form.year" label="Year" type="number" placeholder="2025" />
                  <Input v-model="form.price" label="Price (KSh)" type="number" placeholder="1000000" />
                  <Input v-model="form.sale_price" label="Sale Price" type="number" placeholder="900000" />
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input v-model="form.engine_cc" label="Engine CC" placeholder="e.g. 636" />
                  <Input v-model="form.engine" label="Engine Details" placeholder="e.g. 636cc liquid-cooled inline-4" />
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input v-model="form.horsepower" label="Horsepower" placeholder="e.g. 130hp @ 13,500rpm" />
                  <Input v-model="form.torque" label="Torque" placeholder="e.g. 71Nm @ 11,500rpm" />
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input v-model="form.transmission" label="Transmission" placeholder="e.g. 6-speed" />
                  <Input v-model="form.top_speed" label="Top Speed" placeholder="e.g. 260km/h" />
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input v-model="form.fuel_capacity" label="Fuel Capacity" placeholder="e.g. 17L" />
                  <Input v-model="form.weight" label="Weight" placeholder="e.g. 198kg" />
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input v-model="form.fuel_system" label="Fuel System" placeholder="e.g. EFI" />
                  <Input v-model="form.cooling" label="Cooling System" placeholder="e.g. Liquid-cooled" />
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input v-model="form.starter" label="Starter" placeholder="e.g. Electric" />
                  <Input v-model="form.ignition" label="Ignition" placeholder="e.g. CDI" />
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input v-model="form.battery" label="Battery" placeholder="e.g. 12V 8Ah" />
                  <Input v-model="form.headlight" label="Headlight" placeholder="e.g. LED" />
                </div>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input v-model="form.seat_height" label="Seat Height" placeholder="e.g. 830mm" />
                  <Input v-model="form.ground_clearance" label="Ground Clearance" placeholder="e.g. 160mm" />
                </div>
                <Input v-model="form.braking" label="Braking System" placeholder="e.g. Dual 310mm discs, 4-piston calipers" />
                <Input v-model="form.suspension" label="Suspension" placeholder="e.g. 41mm USD fork (front); Mono-shock (rear)" />
                <Input v-model="form.colors" label="Available Colors" placeholder="e.g. Lime Green, Metallic Spark Black" />
                <Input v-model="form.warranty" label="Warranty" placeholder="e.g. 2 years" />
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Description</label>
                  <textarea v-model="form.description" rows="3" class="input-field w-full resize-none" placeholder="Motorcycle description..." />
                </div>
                <div class="sm:col-span-2">
                  <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Status</label>
                  <select v-model="form.status" class="input-field w-full"><option value="available">Available</option><option value="sold">Sold</option><option value="coming_soon">Coming Soon</option></select>
                </div>
                <div class="sm:col-span-2 flex flex-wrap items-center gap-4 pb-1">
                  <label class="flex items-center gap-2 cursor-pointer text-sm text-brand-grey" :class="{ 'opacity-40 pointer-events-none': form.status === 'sold' }">
                    <input v-model="form.featured" type="checkbox" class="accent-brand-red" :disabled="form.status === 'sold'" /> Featured
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer text-sm text-brand-grey" :class="{ 'opacity-40 pointer-events-none': form.status !== 'available' }">
                    <input v-model="form.new_arrival" type="checkbox" class="accent-brand-red" :disabled="form.status !== 'available'" /> New Arrival
                  </label>
                </div>
                <div class="sm:col-span-2 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-3">
                  <label for="stock-qty-input" class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Stock Quantity</label>
                  <div class="flex flex-wrap items-center gap-3">
                    <input
                      id="stock-qty-input"
                      v-model="form.stock_quantity"
                      type="number"
                      min="0"
                      step="1"
                      inputmode="numeric"
                      class="input-field w-32 rounded-lg"
                      placeholder="0"
                      :aria-invalid="!!stockInputError"
                      :aria-describedby="stockInputError ? 'stock-qty-error' : undefined"
                    />
                    <p v-if="stockInputError" id="stock-qty-error" class="text-xs text-rose-400">{{ stockInputError }}</p>
                    <p v-else class="text-xs text-brand-grey/70">Availability is derived from stock — 0 means Out of Stock. Whole numbers only.</p>
                  </div>
                </div>
                <div class="sm:col-span-2 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-3">
                  <ImagePicker
                    v-model:items="imageItems"
                    v-model:main="mainImage"
                    label="Images"
                    :categories="MC_IMAGE_CATEGORIES"
                    :max="15"
                  />
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-3 border-t border-brand-grey/15 px-6 py-4 shrink-0">
              <Button variant="ghost" @click="closeModal">Cancel</Button>
              <Button :disabled="saving" @click="saveMotorcycle">{{ saving ? 'Saving…' : 'Save Motorcycle' }}</Button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <StockEditorModal :open="stockEditorOpen" :motorcycle="stockEditorItem" @close="stockEditorOpen = false" />
    <StockRemindersModal :open="remindersOpen" :motorcycle="remindersItem" @close="remindersOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import {
  Bike, Plus, Search, X, Star, LayoutGrid, List, Check, ExternalLink, Pencil,
  Trash2, PackageCheck, Clock3, Wallet, Tag, Sparkles, Minus, BellRing, Boxes, AlertTriangle, PackageX, TrendingUp,
} from 'lucide-vue-next'
import StatusChip from '~/components/dashboard/StatusChip.vue'
import RealtimeStatus from '~/components/dashboard/RealtimeStatus.vue'
import StockEditorModal from '~/components/dashboard/StockEditorModal.vue'
import StockRemindersModal from '~/components/dashboard/StockRemindersModal.vue'
import { useAdminDataStore } from '~/stores/adminData'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { getStockStatus, stockOf } from '~/utils/stockStatus'
import ImagePicker from '~/components/dashboard/media/ImagePicker.vue'
import { buildImageItems, appendImagePayload, MC_IMAGE_CATEGORIES } from '~/utils/imageTypes'
import type { ImageItem } from '~/utils/imageTypes'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Motorcycles - Nairobi Powerbikes' })

const store = useAdminDataStore()
const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const route = useRoute()

const view = ref<'grid' | 'table'>('grid')
const searchQuery = ref((route.query.q as string) || '')
const brandFilter = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const stockFilter = ref('')
const featuredOnly = ref(route.query.featured === '1')
const page = ref(1)
const PAGE_SIZE = 9

const saving = ref(false)
const deleting = ref(false)
const showModal = ref(false)
const editingId = ref<string | null>(null)
const imageItems = ref<ImageItem[]>([])
const mainImage = ref(0)
const selectedIds = ref<Set<string>>(new Set())
const stockEditorOpen = ref(false)
const stockEditorItem = ref<any>(null)
const remindersOpen = ref(false)
const remindersItem = ref<any>(null)
const stockInputError = ref('')

const sortKey = ref('name')
const sortDir = ref<'asc' | 'desc'>('asc')

const bikeTypes = ['Sport', 'Cruiser', 'Touring', 'Adventure', 'Naked', 'Dirt', 'Scooter', 'Electric']

const form = ref({
  name: '', slug: '', brand: '', category: '', type: '', year: '', price: '', sale_price: '',
  status: 'available', description: '', engine: '', engine_cc: '',
  horsepower: '', torque: '', transmission: '', top_speed: '',
  fuel_capacity: '', weight: '', fuel_system: '', cooling: '',
  starter: '', ignition: '', battery: '', headlight: '',
  seat_height: '', ground_clearance: '', braking: '', suspension: '',
  colors: '', warranty: '',
  featured: false, new_arrival: false, in_stock: true, stock_quantity: '',
})

watch(() => form.value.status, (status) => {
  if (status === 'sold') {
    form.value.featured = false
    form.value.new_arrival = false
    form.value.in_stock = false
    form.value.stock_quantity = '0'
  } else if (status === 'coming_soon') {
    form.value.new_arrival = false
    form.value.in_stock = false
    form.value.stock_quantity = '0'
  }
})

const inventoryStats = computed(() => {
  const all = store.motorcycles.filter(m => m.status === 'available')
  const level = (m: any) => getStockStatus(stockOf(m)).level
  const inStock = all.filter(m => level(m) === 'in').length
  const low = all.filter(m => level(m) === 'low' || level(m) === 'few').length
  const out = all.filter(m => level(m) === 'out').length
  return [
    { label: 'Total Bikes', value: all.length, icon: Bike, iconBg: 'bg-brand-red/15', iconColor: 'text-brand-red' },
    { label: 'In Stock', value: inStock, icon: PackageCheck, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
    { label: 'Low Stock', value: low, icon: AlertTriangle, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400' },
    { label: 'Out of Stock', value: out, icon: Boxes, iconBg: 'bg-brand-grey/15', iconColor: 'text-brand-grey' },
  ]
})

const stats = computed(() => {
  const all = store.motorcycles
  const count = (p: (m: any) => boolean) => all.filter(p).length
  const unitsInStock = all.reduce((sum, m) => sum + stockOf(m), 0)
  const unitsSold = all.reduce((sum, m) => sum + Number(m.units_sold || 0), 0)
  const salesValue = store.sales
    .filter(s => s.status !== 'cancelled' && s.status !== 'draft')
    .reduce((sum, s) => sum + Number(s.total_payable || 0), 0)
  const waiting = store.reminders.filter(r => r.status === 'active').length
  return [
    { label: 'Total Models', value: all.length, icon: Bike, iconBg: 'bg-brand-red/15', iconColor: 'text-brand-red', dot: true },
    { label: 'Units In Stock', value: unitsInStock.toLocaleString(), icon: Boxes, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
    { label: 'Units Sold', value: unitsSold.toLocaleString(), icon: Wallet, iconBg: 'bg-sky-500/15', iconColor: 'text-sky-400' },
    { label: 'Sales Value (KSh)', value: fmtCompact(salesValue), icon: TrendingUp, iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400' },
    { label: 'Waiting List', value: waiting, icon: BellRing, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400' },
    { label: 'Featured', value: count(m => m.featured), icon: Star, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400' },
    { label: 'Low Stock', value: count(m => ['low', 'few'].includes(getStockStatus(stockOf(m)).level)), icon: AlertTriangle, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400' },
    { label: 'Out of Stock', value: count(m => getStockStatus(stockOf(m)).level === 'out'), icon: PackageX, iconBg: 'bg-rose-500/15', iconColor: 'text-rose-400' },
  ]
})

function fmtCompact(v: number) {
  if (v >= 1_000_000) return (v / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 1 }) + 'M'
  if (v >= 1_000) return (v / 1_000).toLocaleString(undefined, { maximumFractionDigits: 0 }) + 'K'
  return v.toLocaleString()
}

function brandName(id: string) {
  return store.brands.find(b => b.id === id)?.name || 'Unknown'
}

const hasFilters = computed(() => searchQuery.value || brandFilter.value || typeFilter.value || statusFilter.value || stockFilter.value || featuredOnly.value || selectedIds.value.size > 0)

const filtered = computed(() => {
  let list = store.motorcycles.slice()
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(m => [m.name, m.brand, m.engine, m.type, brandName(m.brand)].some(v => String(v || '').toLowerCase().includes(q)))
  }
  if (brandFilter.value) list = list.filter(m => m.brand === brandFilter.value)
  if (typeFilter.value) list = list.filter(m => m.type === typeFilter.value)
  if (statusFilter.value) list = list.filter(m => m.status === statusFilter.value)
  if (stockFilter.value) list = list.filter(m => stockChip(m) === stockFilter.value)
  if (featuredOnly.value) list = list.filter(m => m.featured)
  const dir = sortDir.value === 'asc' ? 1 : -1
  list.sort((a, b) => {
    if (sortKey.value === 'price') return ((a.sale_price || a.price) - (b.sale_price || b.price)) * dir
    if (sortKey.value === 'year') return ((a.year || 0) - (b.year || 0)) * dir
    return String(a[sortKey.value] || '').localeCompare(String(b[sortKey.value] || '')) * dir
  })
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const pageStart = computed(() => (page.value - 1) * PAGE_SIZE)
const pageEnd = computed(() => Math.min(page.value * PAGE_SIZE, filtered.value.length))
const paginated = computed(() => filtered.value.slice(pageStart.value, pageEnd.value))

const pageAllSelected = computed(() => paginated.value.length > 0 && paginated.value.every(m => selectedIds.value.has(m.id)))

watch([searchQuery, brandFilter, typeFilter, statusFilter, stockFilter, featuredOnly, view], () => { page.value = 1 })

function setSort(key: string) {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = key; sortDir.value = 'asc' }
}

function toggleSelect(id: string) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

function togglePage() {
  const next = new Set(selectedIds.value)
  if (pageAllSelected.value) paginated.value.forEach(m => next.delete(m.id))
  else paginated.value.forEach(m => next.add(m.id))
  selectedIds.value = next
}

function resetFilters() {
  searchQuery.value = ''
  brandFilter.value = ''
  typeFilter.value = ''
  statusFilter.value = ''
  stockFilter.value = ''
  featuredOnly.value = false
  selectedIds.value = new Set()
}

function formatPrice(p: number) { return p ? p.toLocaleString() : '0' }

function filesUrl(rec: any, file: string) { return pb.files.getURL(rec, file) }

function validateStockInput(): number | null {
  const raw = String(form.value.stock_quantity ?? '')
  if (raw.trim() === '') return 0
  const n = Number(raw)
  if (!Number.isFinite(n)) { stockInputError.value = 'Enter a valid number.'; return null }
  if (n < 0) { stockInputError.value = 'Stock cannot be negative.'; return null }
  if (!Number.isInteger(n)) { stockInputError.value = 'Stock must be a whole number.'; return null }
  stockInputError.value = ''
  return n
}

watch(() => form.value.stock_quantity, () => { if (stockInputError.value) stockInputError.value = '' })

function stockQty(m: any) { return stockOf(m) }

function stockChip(m: any) { return getStockStatus(stockOf(m)).chip }

function waitingCount(id: string) { return store.reminders.filter(r => r.motorcycle === id && r.status === 'active').length }

function openStockEditor(m: any) { stockEditorItem.value = m; stockEditorOpen.value = true }

function openReminders(m: any) { remindersItem.value = m; remindersOpen.value = true }

async function quickStock(m: any, delta: number) {
  const current = stockOf(m)
  const next = Math.max(0, current + delta)
  if (next === current) return
  try {
    await pb.collection('motorcycles').update(m.id, { stock_quantity: next })
    toast.add({ type: 'success', title: 'Stock updated', message: `${m.name} — ${next} in stock.` })
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Could not update stock', message: e?.message || 'Please try again.' })
  }
}

function resetForm() {
  form.value = {
    name: '', slug: '', brand: '', category: '', type: '', year: '', price: '', sale_price: '',
    status: 'available', description: '', engine: '', engine_cc: '',
    horsepower: '', torque: '', transmission: '', top_speed: '',
    fuel_capacity: '', weight: '', fuel_system: '', cooling: '',
    starter: '', ignition: '', battery: '', headlight: '',
    seat_height: '', ground_clearance: '', braking: '', suspension: '',
    colors: '', warranty: '', featured: false, new_arrival: false, in_stock: true, stock_quantity: '10',
  }
}

function openCreateModal() {
  editingId.value = null
  resetForm()
  stockInputError.value = ''
  imageItems.value = []
  mainImage.value = 0
  showModal.value = true
}

function openEditModal(m: any) {
  editingId.value = m.id
  form.value = {
    name: m.name, slug: m.slug || '', brand: m.brand, category: m.category || '', type: m.type || '',
    year: m.year?.toString() || '', price: m.price?.toString() || '', sale_price: m.sale_price?.toString() || '',
    status: m.status || 'available', description: m.description || '',
    engine: m.engine || '', engine_cc: m.engine_cc || '',
    horsepower: m.horsepower || '', torque: m.torque || '',
    transmission: m.transmission || '', top_speed: m.top_speed || '',
    fuel_capacity: m.fuel_capacity || '', weight: m.weight || '',
    fuel_system: m.fuel_system || '', cooling: m.cooling || '',
    starter: m.starter || '', ignition: m.ignition || '',
    battery: m.battery || '', headlight: m.headlight || '',
    seat_height: m.seat_height || '', ground_clearance: m.ground_clearance || '',
    braking: m.braking || '', suspension: m.suspension || '',
    colors: m.colors || '', warranty: m.warranty || '',
    featured: m.featured || false, new_arrival: m.new_arrival || false, in_stock: m.in_stock ?? true,
    stock_quantity: m.stock_quantity !== undefined && m.stock_quantity !== null ? String(m.stock_quantity) : (m.in_stock ? '10' : '0'),
  }
  stockInputError.value = ''
  const built = buildImageItems(m, 'images', (rec, file) => pb.files.getURL(rec, file))
  imageItems.value = built.items
  mainImage.value = built.main
  showModal.value = true
}

function closeModal() { showModal.value = false }

async function saveMotorcycle() {
  const stockQ = validateStockInput()
  if (stockQ === null) {
    toast.add({ type: 'error', title: 'Invalid stock', message: stockInputError.value || 'Stock must be a whole number of 0 or more.' })
    return
  }
  saving.value = true
  try {
    const data = new FormData()
    const fields = ['name', 'slug', 'brand', 'category', 'type', 'status', 'description', 'engine', 'engine_cc',
      'horsepower', 'torque', 'transmission', 'top_speed', 'fuel_capacity', 'weight',
      'fuel_system', 'cooling', 'starter', 'ignition', 'battery', 'headlight',
      'seat_height', 'ground_clearance', 'braking', 'suspension', 'colors', 'warranty']
    for (const f of fields) {
      if (form.value[f as keyof typeof form.value]) data.append(f, String(form.value[f as keyof typeof form.value]))
    }
    if (form.value.year) data.append('year', form.value.year)
    if (form.value.price) data.append('price', form.value.price)
    if (form.value.sale_price) data.append('sale_price', form.value.sale_price)
    data.append('featured', form.value.featured ? 'true' : 'false')
    data.append('new_arrival', form.value.new_arrival ? 'true' : 'false')
    data.append('stock_quantity', String(stockQ))
    data.append('in_stock', (stockQ > 0 && form.value.status === 'available') ? 'true' : 'false')

    appendImagePayload(data, imageItems.value, 'images')
    data.append('main_image', String(mainImage.value))

    if (editingId.value) {
      await pb.collection('motorcycles').update(editingId.value, data)
      toast.add({ type: 'success', title: 'Motorcycle updated' })
    } else {
      await pb.collection('motorcycles').create(data)
      toast.add({ type: 'success', title: 'Motorcycle added to inventory' })
    }
    closeModal()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to save', message: e?.message || 'Something went wrong' })
  } finally {
    saving.value = false
  }
}

async function confirmDelete(m: any) {
  deleting.value = true
  try {
    const ok = await confirmDlg.confirm({ title: 'Delete Motorcycle', message: `Delete "${m.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
    if (ok) {
      await pb.collection('motorcycles').delete(m.id)
      toast.add({ type: 'success', title: 'Motorcycle deleted' })
    }
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Delete failed', message: e?.message || 'Something went wrong' })
  } finally {
    deleting.value = false
  }
}

async function bulkDelete() {
  const ids = [...selectedIds.value]
  if (!ids.length) return
  deleting.value = true
  try {
    const ok = await confirmDlg.confirm({ title: `Delete ${ids.length} motorcycle(s)?`, message: 'This cannot be undone.', confirmText: 'Delete', confirmType: 'danger' })
    if (ok) {
      await Promise.all(ids.map(id => pb.collection('motorcycles').delete(id)))
      toast.add({ type: 'success', title: `${ids.length} motorcycle(s) deleted` })
      selectedIds.value = new Set()
    }
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Bulk delete failed', message: e?.message || 'Something went wrong' })
  } finally {
    deleting.value = false
  }
}

function exportCsv() {
  const rows = filtered.value.map(m => [m.name, brandName(m.brand), m.type || '', m.year || '', m.status || '', m.sale_price || m.price || '', m.engine_cc || '', stockOf(m)].join(','))
  const csv = ['Name,Brand,Type,Year,Status,Price,EngineCC,Stock', ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `motorcycles-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

onMounted(async () => {
  await store.ensureActive()
  const editId = route.query.edit as string
  if (route.query.create === '1') openCreateModal()
  else if (editId) {
    const found = store.motorcycles.find(m => m.id === editId)
    if (found) openEditModal(found)
  }
})

onUnmounted(() => { store.release() })

watch(showModal, (v) => { document.body.style.overflow = v ? 'hidden' : '' })
</script>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.25s ease; }
.drawer-enter-active .absolute.right-0, .drawer-leave-active .absolute.right-0 { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .absolute.right-0 { transform: translateX(100%); }
.drawer-leave-to .absolute.right-0 { transform: translateX(100%); }

.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from { opacity: 0; transform: translateY(12px); }
.list-leave-to { opacity: 0; transform: scale(0.95); }
</style>