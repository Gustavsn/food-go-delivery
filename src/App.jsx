import { useEffect, useState } from "react";
import { Routes, Route, NavLink, Link, useParams, useNavigate } from "react-router-dom";
import { Home, Search, UserRound, Utensils, MapPin, ChevronRight, ArrowLeft, Clock3, Star, ShoppingBag, LoaderCircle } from "lucide-react";
import { getData, asList, pick, imageOf, titleOf, priceOf, descriptionOf, idOf } from "./api";

const money = (v) => v || "Consulte o preço";
const fallbackFood = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800";
const fallbackRestaurant = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800";

function useApi(path) {
  const [state, setState] = useState({ data: [], loading: true, error: "" });
  useEffect(() => {
    let active = true;
    getData(path)
      .then((result) => active && setState({ data: result, loading: false, error: "" }))
      .catch((err) => active && setState({ data: [], loading: false, error: err.message }));
    return () => { active = false; };
  }, [path]);
  return state;
}

function Header({ subtitle = "Peça sua comida favorita" }) {
  return <header className="topbar">
    <Link to="/" className="brand">food<span>go</span><b>.</b></Link>
    <div className="location"><MapPin size={16}/><span>Taquara, RS</span></div>
    <div className="header-subtitle">{subtitle}</div>
  </header>;
}

function BottomNav() {
  return <nav className="bottom-nav">
    <NavLink to="/" end><Home/><span>Início</span></NavLink>
    <NavLink to="/restaurants"><Utensils/><span>Restaurantes</span></NavLink>
    <NavLink to="/foods"><Search/><span>Comidas</span></NavLink>
    <NavLink to="/profile"><UserRound/><span>Perfil</span></NavLink>
  </nav>;
}

function Loading() { return <div className="status"><LoaderCircle className="spin"/> Carregando dados...</div>; }
function ErrorBox({ error }) { return <div className="error-box"><strong>Não foi possível carregar a API.</strong><p>{error}</p><small>Confira sua conexão e tente novamente. As telas já estão preparadas para receber os dados.</small></div>; }
function SectionTitle({ title, to }) { return <div className="section-title"><h2>{title}</h2>{to && <Link to={to}>Ver todos <ChevronRight size={16}/></Link>}</div>; }

function ItemCard({ item, kind, index }) {
  const id = idOf(item, index);
  const isFood = kind === "foods";
  const image = imageOf(item) || (isFood ? fallbackFood : fallbackRestaurant);
  return <Link className="item-card" to={`/${kind}/${id}`}>
    <img src={image} alt={titleOf(item)} onError={(e) => { e.currentTarget.src = isFood ? fallbackFood : fallbackRestaurant; }}/>
    <div className="item-card-body">
      <strong>{titleOf(item)}</strong>
      <p>{isFood ? money(priceOf(item)) : pick(item, ["category", "type", "cuisine", "categoria"], "Restaurante")}</p>
      <small><Clock3 size={13}/> {pick(item, ["deliveryTime", "time", "preparationTime", "tempoEntrega"], "30–50 min")}</small>
    </div>
  </Link>;
}

function HomePage() {
  const foods = useApi("/foods");
  const restaurants = useApi("/restaurants");
  const user = useApi("/users/1");
  const foodList = asList(foods.data);
  const restaurantList = asList(restaurants.data);
  const userObj = asList(user.data)[0];
  return <><Header/>
    <main className="page">
      <section className="hero">
        <div><span className="eyebrow">BATEU A FOME?</span><h1>Seu próximo<br/>pedido está aqui.</h1><p>Peça fácil. Receba rápido.</p><Link to="/foods" className="primary-btn">Ver comidas <ChevronRight size={17}/></Link></div>
        <div className="hero-art">🍔</div>
      </section>
      <div className="welcome">Olá, {userObj ? titleOf(userObj, "tudo bem") : "tudo bem"}! <span>O que vamos pedir hoje?</span></div>
      <SectionTitle title="Comidas recomendadas" to="/foods"/>
      {foods.loading ? <Loading/> : foods.error ? <ErrorBox error={foods.error}/> : <div className="horizontal-list">{foodList.slice(0, 6).map((item, i) => <ItemCard key={idOf(item, i)} item={item} kind="foods" index={i}/>)}</div>}
      <SectionTitle title="Restaurantes recomendados" to="/restaurants"/>
      {restaurants.loading ? <Loading/> : restaurants.error ? <ErrorBox error={restaurants.error}/> : <div className="horizontal-list">{restaurantList.slice(0, 6).map((item, i) => <ItemCard key={idOf(item, i)} item={item} kind="restaurants" index={i}/>)}</div>}
    </main><BottomNav/></>;
}

function ListPage({ kind }) {
  const isFood = kind === "foods";
  const { data, loading, error } = useApi(`/${kind}`);
  const items = asList(data);
  const [query, setQuery] = useState("");
  const filtered = items.filter((item) => titleOf(item).toLowerCase().includes(query.toLowerCase()));
  return <><Header subtitle={isFood ? "Descubra seu próximo prato" : "Encontre seu lugar favorito"}/>
    <main className="page">
      <div className="page-heading"><span className="eyebrow">{isFood ? "CARDÁPIO" : "ONDE PEDIR"}</span><h1>{isFood ? "Todas as comidas" : "Restaurantes"}</h1><p>{isFood ? "Escolha algo gostoso para hoje." : "Os melhores lugares em um só lugar."}</p></div>
      <label className="search-box"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={isFood ? "Buscar comida..." : "Buscar restaurante..."}/></label>
      {loading ? <Loading/> : error ? <ErrorBox error={error}/> : <div className="grid-list">{filtered.map((item, i) => <ItemCard key={idOf(item, i)} item={item} kind={kind} index={i}/>)}</div>}
      {!loading && !error && filtered.length === 0 && <p className="empty">Nenhum resultado encontrado.</p>}
    </main><BottomNav/></>;
}

function DetailPage({ kind }) {
  const { id } = useParams();
  const { data, loading, error } = useApi(`/${kind}/${id}`);
  const item = asList(data)[0];
  const isFood = kind === "foods";
  const image = item ? imageOf(item) : "";
  return <><Header/><main className="page detail-page">
    <Link to={isFood ? "/foods" : "/restaurants"} className="back-link"><ArrowLeft size={17}/> Voltar</Link>
    {loading ? <Loading/> : error ? <ErrorBox error={error}/> : item ? <>
      <img className="detail-image" src={image || (isFood ? fallbackFood : fallbackRestaurant)} alt={titleOf(item)} onError={(e) => { e.currentTarget.src = isFood ? fallbackFood : fallbackRestaurant; }}/>
      <span className="eyebrow">{isFood ? "DETALHE DA COMIDA" : "DETALHE DO RESTAURANTE"}</span>
      <h1>{titleOf(item)}</h1>
      <p className="detail-description">{descriptionOf(item)}</p>
      <div className="detail-info">
        {isFood && <div><strong>Preço</strong><span>{money(priceOf(item))}</span></div>}
        <div><strong>Informações</strong><span>{pick(item, ["category", "type", "cuisine", "address", "addressLine"], "Consulte o estabelecimento")}</span></div>
        <div><strong>Entrega</strong><span>{pick(item, ["deliveryTime", "time", "preparationTime"], "30–50 min")}</span></div>
      </div>
      <button className="primary-btn wide" onClick={() => alert("Protótipo acadêmico: pedido demonstrativo!")}>{isFood ? "Adicionar ao pedido" : "Ver cardápio"} <ShoppingBag size={17}/></button>
      <details className="raw-data"><summary>Ver dados recebidos da API</summary><pre>{JSON.stringify(item, null, 2)}</pre></details>
    </> : <p>Não encontramos esse item.</p>}
  </main><BottomNav/></>;
}

function ProfilePage() {
  const users = useApi("/users");
  const userDetail = useApi("/users/1");
  const user = asList(userDetail.data)[0];
  const list = asList(users.data);
  return <><Header subtitle="Seus dados e sua conta"/><main className="page">
    <div className="page-heading"><span className="eyebrow">MINHA CONTA</span><h1>Meu perfil</h1><p>Informações do usuário cadastrado.</p></div>
    {userDetail.loading || users.loading ? <Loading/> : userDetail.error ? <ErrorBox error={userDetail.error}/> : <div className="profile-card">
      <div className="avatar"><UserRound size={36}/></div><h2>{titleOf(user, "Usuário FoodGo")}</h2>
      <p>{pick(user, ["email", "mail"], "E-mail não informado")}</p>
      <div className="detail-info">
        <div><strong>Telefone</strong><span>{pick(user, ["phone", "telephone", "telefone"], "Não informado")}</span></div>
        <div><strong>Endereço</strong><span>{pick(user, ["address", "street", "endereco"], "Não informado")}</span></div>
        <div><strong>Usuários disponíveis na API</strong><span>{list.length}</span></div>
      </div>
      <details className="raw-data"><summary>Ver dados recebidos da API</summary><pre>{JSON.stringify(user, null, 2)}</pre></details>
    </div>}
  </main><BottomNav/></>;
}

export default function App() {
  return <div className="app-shell"><Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/restaurants" element={<ListPage kind="restaurants"/>}/>
    <Route path="/restaurants/:id" element={<DetailPage kind="restaurants"/>}/>
    <Route path="/foods" element={<ListPage kind="foods"/>}/>
    <Route path="/foods/:id" element={<DetailPage kind="foods"/>}/>
    <Route path="/profile" element={<ProfilePage/>}/>
    <Route path="*" element={<main className="page"><h1>Página não encontrada</h1><Link to="/">Voltar ao início</Link></main>}/>
  </Routes></div>;
}