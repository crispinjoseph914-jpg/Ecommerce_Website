'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Filter,
  Heart, LayoutDashboard, Leaf, Menu, Minus, Package, Plus, Search, ShoppingBag,
  SlidersHorizontal, Sparkles, Star, X,
} from 'lucide-react'

type Product = { id: number; name: string; category: string; price: number; oldPrice?: number; rating: string; reviews: number; image: string; color: string; tag?: string; stock: number }

const products: Product[] = [
  { id: 1, name: 'Forma Lounge Chair', category: 'Furniture', price: 489, oldPrice: 620, rating: '4.9', reviews: 128, image: 'photo-1567538096630-e0c55bd6374c', color: 'Warm oak', tag: 'Bestseller', stock: 12 },
  { id: 2, name: 'Arc Table Lamp', category: 'Lighting', price: 168, rating: '4.8', reviews: 84, image: 'photo-1507473885765-e6ed057f782c', color: 'Soft white', tag: 'New', stock: 8 },
  { id: 3, name: 'Everyday Ceramic Set', category: 'Objects', price: 74, oldPrice: 92, rating: '4.9', reviews: 203, image: 'photo-1578749556568-bc2c40e68b61', color: 'Chalk', stock: 24 },
  { id: 4, name: 'Sculpted Side Table', category: 'Furniture', price: 295, rating: '4.7', reviews: 56, image: 'photo-1499933374294-4584851497cc', color: 'Natural ash', stock: 5 },
  { id: 5, name: 'Stillness Linen Throw', category: 'Textiles', price: 118, rating: '4.8', reviews: 91, image: 'photo-1600210492486-724fe5c67fb0', color: 'Oatmeal', tag: 'Limited', stock: 15 },
  { id: 6, name: 'Forma Lounge Chair', category: 'Furniture', price: 489, rating: '4.9', reviews: 128, image: 'photo-1598300056393-4aac492f4344', color: 'Forest', stock: 4 },
  { id: 7, name: 'Tapered Floor Light', category: 'Lighting', price: 342, rating: '4.6', reviews: 47, image: 'photo-1507473885765-e6ed057f782c', color: 'Brushed brass', stock: 9 },
  { id: 8, name: 'Sora Serving Bowl', category: 'Objects', price: 56, rating: '4.9', reviews: 162, image: 'photo-1578749556568-bc2c40e68b61', color: 'Sand', stock: 32 },
]
const categories = ['All pieces', 'Furniture', 'Lighting', 'Objects', 'Textiles']
const photo = (id: string, width = 760) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

type Cart = Record<number, number>

function IconButton({ label, children, onClick, className = '' }: { label: string; children: React.ReactNode; onClick: () => void; className?: string }) {
  return <button type="button" aria-label={label} onClick={onClick} className={`icon-button ${className}`}>{children}</button>
}

function Header({ count, onCart, onAdmin }: { count: number; onCart: () => void; onAdmin: () => void }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  return <>
    <div className="announcement"><span>Thoughtful objects for slower living</span><span className="announcement-note">Complimentary shipping on orders over $150 <ArrowRight size={13} /></span></div>
    <header className="site-header">
      <button className="mobile-menu icon-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu /></button>
      <nav className="nav-left" aria-label="Main navigation"><a href="#shop">Shop</a><a href="#story">Our story</a><a href="#journal">Journal</a></nav>
      <a className="wordmark" href="#top" aria-label="Hearth and Form home"><span className="brand-mark"><Leaf size={18} strokeWidth={1.6} /></span>hearth<span className="wordmark-and">&</span>form</a>
      <div className="nav-right">
        <button className="admin-link" onClick={onAdmin}><LayoutDashboard size={15} /> <span>Studio</span></button>
        <IconButton label="Search products" onClick={() => setSearchOpen(!searchOpen)}><Search size={19} /></IconButton>
        <IconButton label={`Shopping bag, ${count} items`} onClick={onCart} className="bag-trigger"><ShoppingBag size={19} /><span>Bag ({count})</span></IconButton>
      </div>
    </header>
    {menuOpen && <nav className="mobile-menu-panel" aria-label="Mobile navigation"><a href="#shop" onClick={() => setMenuOpen(false)}>Shop collection <ArrowRight size={15} /></a><a href="#story" onClick={() => setMenuOpen(false)}>Our story <ArrowRight size={15} /></a><a href="#journal" onClick={() => setMenuOpen(false)}>Journal <ArrowRight size={15} /></a><button onClick={() => { setMenuOpen(false); onAdmin() }}><LayoutDashboard size={15} /> Open store studio</button></nav>}
    {searchOpen && <div className="search-strip"><Search size={18} /><input autoFocus aria-label="Search products" placeholder="Search considered pieces..." onChange={(e) => window.dispatchEvent(new CustomEvent('store-search', { detail: e.target.value }))} /><button onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={18} /></button></div>}
  </>
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (id: number) => void }) {
  const [liked, setLiked] = useState(false)
  return <article className="product-card">
    <div className="product-image-wrap"><img src={photo(product.image)} alt={product.name} className="product-image" loading="lazy" />
      {product.tag && <span className={`product-tag ${product.tag === 'Bestseller' ? 'tag-dark' : ''}`}>{product.tag}</span>}
      <IconButton label={liked ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => setLiked(!liked)} className={`wishlist ${liked ? 'is-liked' : ''}`}><Heart size={17} fill={liked ? 'currentColor' : 'none'} /></IconButton>
      <button className="quick-add" onClick={() => onAdd(product.id)}><Plus size={15} /> Add to bag</button>
    </div>
    <div className="product-info"><div><h3>{product.name}</h3><p>{product.color}</p></div><div className="product-price"><strong>${product.price}</strong>{product.oldPrice && <del>${product.oldPrice}</del>}</div></div>
    <div className="product-rating"><Star size={12} fill="currentColor" /><span>{product.rating}</span><span className="review-count">({product.reviews})</span></div>
  </article>
}

function CartDrawer({ cart, onClose, onUpdate }: { cart: Cart; onClose: () => void; onUpdate: (id: number, value: number) => void }) {
  const lines = products.filter((item) => cart[item.id])
  const subtotal = lines.reduce((sum, item) => sum + item.price * cart[item.id], 0)
  return <div className="drawer-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
    <aside className="cart-drawer" aria-label="Shopping bag" aria-modal="true" role="dialog"><div className="drawer-head"><div><span className="eyebrow">YOUR SELECTION</span><h2>Shopping bag <span>({lines.reduce((n, item) => n + cart[item.id], 0)})</span></h2></div><IconButton label="Close bag" onClick={onClose}><X /></IconButton></div>
      {lines.length === 0 ? <div className="cart-empty"><ShoppingBag size={28} /><h3>Your bag is waiting</h3><p>Find something meaningful for your space.</p><button className="button-dark" onClick={onClose}>Explore the collection <ArrowRight size={16} /></button></div> : <>
        <div className="cart-lines">{lines.map((item) => <div className="cart-line" key={item.id}><img src={photo(item.image, 220)} alt="" /><div className="cart-line-details"><h3>{item.name}</h3><p>{item.color}</p><strong>${item.price}</strong><div className="quantity-control"><button aria-label={`Remove one ${item.name}`} onClick={() => onUpdate(item.id, cart[item.id] - 1)}><Minus size={13} /></button><span>{cart[item.id]}</span><button aria-label={`Add one ${item.name}`} onClick={() => onUpdate(item.id, cart[item.id] + 1)}><Plus size={13} /></button></div></div><button className="remove-line" onClick={() => onUpdate(item.id, 0)}>Remove</button></div>)}</div>
        <div className="drawer-bottom"><div className="shipping-progress"><span><Check size={14} /> You&apos;ve unlocked complimentary shipping</span><div><i /></div></div><div className="subtotal-row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><p className="tax-note">Shipping and taxes calculated at checkout.</p><button className="button-dark checkout-button" onClick={() => alert('Checkout is a UI preview. Connect the MySQL backend to place real orders.')}>Continue to checkout <ArrowRight size={16} /></button></div>
      </>}
    </aside>
  </div>
}

function StudioDashboard({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState('Overview')
  const menu = ['Overview', 'Products', 'Orders', 'Customers', 'Categories', 'Settings']
  return <main className="studio-shell"><aside className="studio-sidebar"><button className="studio-brand" onClick={onClose}><span className="brand-mark"><Leaf size={17} /></span> hearth&form <span className="studio-label">STUDIO</span></button><div className="studio-store"><span className="store-avatar">H</span><span><strong>Hearth & Form</strong><small>Design shop</small></span><ChevronDown size={15} /></div><nav aria-label="Studio navigation">{menu.map((label, i) => <button key={label} onClick={() => setTab(label)} className={tab === label ? 'studio-nav-active' : ''}>{[<LayoutDashboard key="o" />, <Package key="p" />, <ShoppingBag key="r" />, <Heart key="c" />, <SlidersHorizontal key="a" />, <Sparkles key="s" />][i]}{label}{label === 'Orders' && <span className="nav-count">6</span>}</button>)}</nav><div className="sidebar-bottom"><div className="help-card"><span>Need a hand?</span><p>Our team is here to help you grow.</p><button>Visit help center <ArrowUpRight size={13} /></button></div><div className="profile-chip"><span className="profile-avatar">AM</span><span><strong>Alex Morgan</strong><small>Store owner</small></span><ChevronDown size={14} /></div></div></aside>
    <section className="studio-main"><header className="studio-topbar"><div><span>Hearth & Form</span><span className="crumb">/</span><strong>{tab}</strong></div><div className="studio-tools"><span className="live-indicator"><i /> Preview data</span><button className="view-store" onClick={onClose}>View store <ArrowUpRight size={14} /></button><span className="profile-avatar">AM</span></div></header>
      <div className="studio-content"><div className="studio-title-row"><div><div className="eyebrow">WEDNESDAY, NOVEMBER 18, 2026</div><h1>{tab === 'Overview' ? 'Good morning, Alex' : tab}</h1><p>{tab === 'Overview' ? 'Here’s what’s happening with your store today.' : `Manage your store ${tab.toLowerCase()} at a glance.`}</p></div><button className="button-dark small-button" onClick={() => setTab('Products')}><Plus size={15} /> Add a product</button></div>
        {tab === 'Overview' ? <><div className="metric-grid">{[['Gross sales', '$12,480', '+12.8%'], ['Orders', '184', '+8.2%'], ['Average order value', '$67.83', '+4.3%'], ['Store visits', '8,642', '+18.1%']].map(([label, value, change]) => <div className="metric-card" key={label}><div><span>{label}</span><button aria-label={`More about ${label}`}><span>···</span></button></div><strong>{value}</strong><p><span><ArrowUpRight size={13} /> {change}</span> vs. last month</p></div>)}</div>
          <div className="studio-panels"><section className="sales-panel"><div className="panel-heading"><div><h2>Sales over time</h2><p>Your store performance at a glance</p></div><button className="period-select">Last 7 days <ChevronDown size={14} /></button></div><div className="chart-summary"><strong>$4,860.50</strong><span> <ArrowUpRight size={13} /> 14.2%</span></div><div className="chart-area"><div className="chart-ylabels"><span>$2k</span><span>$1.5k</span><span>$1k</span><span>$500</span><span>$0</span></div><div className="chart-plot"><div className="chart-grid"><i /><i /><i /><i /><i /></div><svg viewBox="0 0 640 170" preserveAspectRatio="none" role="img" aria-label="Sales trending upward throughout the week"><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#41624d" stopOpacity=".20" /><stop offset="100%" stopColor="#41624d" stopOpacity="0" /></linearGradient></defs><path d="M0 142 C32 137 45 140 70 122 S112 130 137 111 S177 116 205 90 S243 109 272 95 S309 99 340 67 S378 81 406 72 S445 87 477 48 S517 62 543 41 S586 58 613 26 L640 18 L640 170 L0 170Z" fill="url(#chart-fill)" /><path d="M0 142 C32 137 45 140 70 122 S112 130 137 111 S177 116 205 90 S243 109 272 95 S309 99 340 67 S378 81 406 72 S445 87 477 48 S517 62 543 41 S586 58 613 26 L640 18" fill="none" stroke="#41624d" strokeWidth="2.3" vectorEffect="non-scaling-stroke" /></svg><div className="chart-xlabels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div></div></section>
            <section className="top-products"><div className="panel-heading"><div><h2>Top products</h2><p>Best performers this week</p></div><button aria-label="View products"><ArrowUpRight size={16} /></button></div>{products.slice(0, 4).map((product, i) => <div className="top-product" key={product.id}><span className="top-rank">0{i + 1}</span><img src={photo(product.image, 120)} alt="" /><div><strong>{product.name}</strong><small>{[42, 31, 26, 18][i]} sold</small></div><b>${[20358, 5208, 1924, 5310][i].toLocaleString()}</b></div>)}</section></div>
          <section className="orders-panel"><div className="panel-heading"><div><h2>Recent orders</h2><p>Keep an eye on your latest orders</p></div><button className="text-link" onClick={() => setTab('Orders')}>View all orders <ArrowRight size={14} /></button></div><div className="orders-table-wrap"><table><thead><tr><th>ORDER</th><th>DATE</th><th>CUSTOMER</th><th>PAYMENT</th><th>STATUS</th><th>TOTAL</th><th /></tr></thead><tbody>{[['#HF-2084','Nov 18, 2026','Olivia Rhye','Paid','Fulfilled','$489.00'],['#HF-2083','Nov 18, 2026','Phoenix Baker','Paid','Processing','$342.00'],['#HF-2082','Nov 17, 2026','Lana Steiner','Pending','Unfulfilled','$168.00'],['#HF-2081','Nov 17, 2026','Demi Wilkinson','Paid','Fulfilled','$563.00']].map(([id,date,name,payment,status,total])=><tr key={id}><td className="order-id">{id}</td><td>{date}</td><td>{name}</td><td><span className={`payment-dot ${payment==='Pending'?'pending':''}`} />{payment}</td><td><span className={`status-pill ${status==='Processing'?'status-processing':status==='Unfulfilled'?'status-unfulfilled':''}`}><i />{status}</span></td><td className="order-total">{total}</td><td><button aria-label={`Open order ${id}`}><ArrowUpRight size={14} /></button></td></tr>)}</tbody></table></div></section>
        </> : <section className="orders-panel placeholder-panel"><div className="empty-icon"><Package /></div><h2>{tab} management</h2><p>This workspace is ready to connect to your MySQL store data.</p><span className="preview-tag">UI PREVIEW · DATABASE NOT CONNECTED</span></section>}
      </div>
    </section></main>
}

export default function Storefront() {
  const [cart, setCart] = useState<Cart>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [studio, setStudio] = useState(false)
  const [category, setCategory] = useState('All pieces')
  const [sortBy, setSortBy] = useState('Featured')
  const [query, setQuery] = useState('')
  const [saleOnly, setSaleOnly] = useState(false)
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  const filtered = useMemo(() => {
    let result = products.filter((product) => (category === 'All pieces' || product.category === category) && (!saleOnly || product.oldPrice) && `${product.name} ${product.category} ${product.color}`.toLowerCase().includes(query.toLowerCase()))
    if (sortBy === 'Price: low to high') result = [...result].sort((a, b) => a.price - b.price)
    if (sortBy === 'Price: high to low') result = [...result].sort((a, b) => b.price - a.price)
    if (sortBy === 'Top rated') result = [...result].sort((a, b) => Number(b.rating) - Number(a.rating))
    return result
  }, [category, query, saleOnly, sortBy])
  const add = (id: number) => setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }))
  const update = (id: number, quantity: number) => setCart((current) => { const next = { ...current }; if (quantity <= 0) delete next[id]; else next[id] = quantity; return next })
  if (studio) return <StudioDashboard onClose={() => setStudio(false)} />
  return <main id="top" className="storefront">
    <Header count={count} onCart={() => setCartOpen(true)} onAdmin={() => setStudio(true)} />
    <section className="hero" id="story"><img src={photo('photo-1600210492486-724fe5c67fb0', 1900)} alt="Sun-washed living room with thoughtfully crafted furniture" /><div className="hero-shade" /><div className="hero-content"><span className="hero-kicker"><span /> THE ART OF A SLOWER HOME</span><h1>Make room<br />for <em>meaning.</em></h1><p>Considered design, made for the everyday.<br />Discover the pieces that feel like home.</p><a href="#shop" className="hero-button">Explore the collection <ArrowRight size={16} /></a><div className="hero-count"><span>01</span><i /><span>03</span></div></div><div className="hero-caption">A quieter kind of comfort <span>—</span> The Sora collection</div><button className="hero-next" aria-label="Next collection"><ArrowRight size={18} /></button></section>
    <section className="promise-strip" aria-label="Our commitments"><span><Leaf size={16} /> Made with intention</span><i /><span>Natural materials, always</span><i /><span>Designed to last a lifetime</span><i /><span>Small-batch, thoughtfully made</span></section>
    <section id="shop" className="shop-section"><div className="section-heading"><div><span className="eyebrow">THE OBJECTS WE LIVE WITH</span><h2>Find your everyday.</h2><p>Pieces with purpose. Made to be kept.</p></div><a className="view-all" href="#shop">Discover our story <ArrowUpRight size={15} /></a></div>
      <div className="shop-toolbar"><div className="category-tabs" role="tablist" aria-label="Filter by category">{categories.map((item) => <button key={item} role="tab" aria-selected={category === item} className={category === item ? 'category-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="filter-actions"><button className={`sale-filter ${saleOnly ? 'sale-active' : ''}`} onClick={() => setSaleOnly(!saleOnly)}><Filter size={14} /> On sale</button><label className="sort-label"><span>Sort:</span><select value={sortBy} onChange={(e) => setSortBy(e.target.value)} aria-label="Sort products"><option>Featured</option><option>Top rated</option><option>Price: low to high</option><option>Price: high to low</option></select><ChevronDown size={14} /></label></div></div>
      {query && <div className="search-result-label">Showing results for “{query}” <button onClick={() => setQuery('')}>Clear</button></div>}
      {filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} onAdd={add} />)}</div> : <div className="no-results"><Search size={22} /><h3>No pieces found</h3><p>Try a different search or category.</p><button onClick={() => { setQuery(''); setCategory('All pieces'); setSaleOnly(false) }}>Clear filters</button></div>}
      <div className="collection-cta"><span>FIND YOUR NEW FAVORITE</span><p>Good things, made to be lived with.</p><a href="#shop">Shop all pieces <ArrowRight size={15} /></a></div>
    </section>
    <section className="story-banner"><div className="story-photo"><img src={photo('photo-1616486338812-3dadae4b4ace', 1000)} alt="Warm neutral interior with handcrafted wooden accents" /></div><div className="story-copy"><span className="eyebrow">A HOME, MORE HUMAN</span><h2>Less, but with<br /><em>more meaning.</em></h2><p>We believe the things we keep should make life feel a little more like our own. Thoughtfully sourced. Made with care. Always considered.</p><a href="#story">A little about us <ArrowRight size={15} /></a></div></section>
    <footer className="site-footer" id="journal"><div className="footer-top"><div><a className="wordmark footer-wordmark" href="#top"><span className="brand-mark"><Leaf size={18} /></span>hearth<span className="wordmark-and">&</span>form</a><p>Objects to make your house<br />feel more like you.</p></div><div className="footer-links"><div><strong>Explore</strong><a href="#shop">Shop all</a><a href="#shop">Furniture</a><a href="#shop">Objects</a><a href="#story">Our story</a></div><div><strong>We're here</strong><a href="#journal">Contact</a><a href="#journal">Shipping & returns</a><a href="#journal">FAQs</a><a href="#journal">Instagram ↗</a></div><div className="newsletter"><strong>A note from us</strong><p>Occasional inspiration, new arrivals, and good things for the home.</p><form onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!') }}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" required placeholder="Your email address"/><button aria-label="Subscribe"><ArrowRight size={17}/></button></form></div></div></div><div className="footer-bottom"><span>© 2026 Hearth & Form. Made with intention.</span><div><a href="#journal">Privacy</a><a href="#journal">Terms</a></div><span>Designed for living well.</span></div></footer>
    {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onUpdate={update} />}
    <span className="sr-only" aria-live="polite">{count > 0 ? `${count} items in your shopping bag` : ''}</span>
    <SearchListener onQuery={setQuery} />
  </main>
}

function SearchListener({ onQuery }: { onQuery: (value: string) => void }) {
  useEffect(() => {
    const handler = (event: Event) => onQuery((event as CustomEvent<string>).detail)
    window.addEventListener('store-search', handler)
    return () => window.removeEventListener('store-search', handler)
  }, [onQuery])
  return null
}
