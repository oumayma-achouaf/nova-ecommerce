import {
  Archive,
  Check,
  CheckCheck,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  MoreVertical,
  Package,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  ShoppingBag,
  ShoppingCart,
  Smile,
  Users,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

import AdminHeader from '../../components/layout/AdminHeader.jsx'
import AdminSidebar from '../../components/layout/AdminSidebar.jsx'

const initialConversations = [
  {
    id: 1,
    name: 'Yassine Benali',
    avatar: '/images/products/nova-category-men.jpg',
    initials: 'YB',
    preview: 'Bonjour, où en est ma commande #10024 ?',
    time: '10:24',
    unread: 2,
    status: 'pending',
    online: true,
    order: 'Commande #10024',
    customerSince: 'Client depuis janv. 2024',
    email: 'yassine.benali@gmail.com',
    phone: '+212 6 12 34 56 78',
    location: 'Casablanca',
    orderCount: 5,
    spent: '2 450 DH',
    tags: ['VIP', 'Livraison standard'],
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        text: 'Bonjour, où en est ma commande #10024 ?\nJ’aimerais savoir quand elle sera livrée.',
        time: '10:24',
      },
      {
        id: 'm2',
        sender: 'admin',
        text: 'Bonjour Yassine,\n\nVotre commande #10024 a été expédiée hier et est désormais en transit. Vous devriez la recevoir sous 2 à 3 jours ouvrés.\n\nVoici votre numéro de suivi : NV123456789.\n\nN’hésitez pas si vous avez d’autres questions !',
        time: '10:27',
        read: true,
      },
      {
        id: 'm3',
        sender: 'customer',
        text: 'Parfait, merci beaucoup pour votre retour !\nC’est exactement ce que je voulais savoir.',
        time: '10:29',
      },
      {
        id: 'm4',
        sender: 'admin',
        text: 'Avec plaisir !\nBonne journée et à très bientôt sur NOVA.',
        time: '10:30',
        read: true,
      },
    ],
  },
  {
    id: 2,
    name: 'Sara El Amrani',
    avatar: '/images/products/nova-category-women.jpg',
    initials: 'SA',
    preview: 'Merci pour votre réponse !',
    time: '09:18',
    unread: 1,
    status: 'open',
    online: false,
    order: 'Commande #10023',
    customerSince: 'Client depuis mars 2024',
    email: 'sara.elamrani@gmail.com',
    phone: '+212 6 78 90 12 34',
    location: 'Rabat',
    orderCount: 3,
    spent: '1 780 DH',
    tags: ['Fidèle'],
    messages: [
      {
        id: 's1',
        sender: 'customer',
        text: 'Merci pour votre réponse !',
        time: '09:18',
      },
    ],
  },
  {
    id: 3,
    name: 'Omar Haddad',
    avatar: '/images/products/nova-category-men.jpg',
    initials: 'OH',
    preview: 'Puis-je retourner un article ?',
    time: 'Hier',
    unread: 1,
    status: 'pending',
    online: false,
    order: 'Commande #10022',
    customerSince: 'Client depuis févr. 2024',
    email: 'omar.haddad@gmail.com',
    phone: '+212 6 22 45 67 89',
    location: 'Marrakech',
    orderCount: 2,
    spent: '980 DH',
    tags: ['Retour'],
    messages: [
      {
        id: 'o1',
        sender: 'customer',
        text: 'Puis-je retourner un article ?',
        time: 'Hier',
      },
    ],
  },
  {
    id: 4,
    name: 'Lina Kettani',
    avatar: '/images/products/nova-category-women.jpg',
    initials: 'LK',
    preview: 'Quelle est la différence entre les tailles S et M ?',
    time: 'Hier',
    unread: 0,
    status: 'open',
    online: false,
    order: 'Commande #10021',
    customerSince: 'Client depuis avr. 2024',
    email: 'lina.kettani@gmail.com',
    phone: '+212 6 33 12 45 78',
    location: 'Casablanca',
    orderCount: 4,
    spent: '2 120 DH',
    tags: ['Taille'],
    messages: [
      {
        id: 'l1',
        sender: 'customer',
        text: 'Quelle est la différence entre les tailles S et M ?',
        time: 'Hier',
      },
    ],
  },
  {
    id: 5,
    name: 'Mehdi Rachid',
    avatar: '/images/products/nova-category-men.jpg',
    initials: 'MR',
    preview: 'Est-ce que vous avez des codes promo ?',
    time: '28 sept.',
    unread: 0,
    status: 'open',
    online: false,
    order: 'Commande #10020',
    customerSince: 'Client depuis mai 2024',
    email: 'mehdi.rachid@gmail.com',
    phone: '+212 6 44 56 78 90',
    location: 'Tanger',
    orderCount: 6,
    spent: '3 450 DH',
    tags: ['Promo'],
    messages: [
      {
        id: 'm5',
        sender: 'customer',
        text: 'Est-ce que vous avez des codes promo ?',
        time: '28 sept.',
      },
    ],
  },
  {
    id: 6,
    name: 'Nour Idrissi',
    avatar: '/images/products/nova-category-women.jpg',
    initials: 'NI',
    preview: 'Ma commande est toujours en attente...',
    time: '27 sept.',
    unread: 0,
    status: 'pending',
    online: false,
    order: 'Commande #10019',
    customerSince: 'Client depuis juin 2024',
    email: 'nour.idrissi@gmail.com',
    phone: '+212 6 55 23 67 81',
    location: 'Fès',
    orderCount: 1,
    spent: '690 DH',
    tags: ['En attente'],
    messages: [
      {
        id: 'n1',
        sender: 'customer',
        text: 'Ma commande est toujours en attente...',
        time: '27 sept.',
      },
    ],
  },
  {
    id: 7,
    name: 'Karim Zahiri',
    avatar: '/images/products/nova-category-men.jpg',
    initials: 'KZ',
    preview: 'Merci beaucoup pour votre aide !',
    time: '26 sept.',
    unread: 0,
    status: 'resolved',
    online: false,
    order: 'Commande #10018',
    customerSince: 'Client depuis juil. 2024',
    email: 'karim.zahiri@gmail.com',
    phone: '+212 6 66 98 21 45',
    location: 'Agadir',
    orderCount: 2,
    spent: '1 140 DH',
    tags: ['Résolu'],
    messages: [
      {
        id: 'k1',
        sender: 'customer',
        text: 'Merci beaucoup pour votre aide !',
        time: '26 sept.',
      },
    ],
  },
]

const tabs = [
  ['all', 'Tous'],
  ['unread', 'Non lus'],
  ['pending', 'En attente'],
  ['resolved', 'Résolus'],
]

const activity = [
  {
    icon: ShoppingCart,
    title: 'Commande #10024 confirmée',
    time: 'Il y a 2 jours',
  },
  {
    icon: MessageCircle,
    title: 'Message reçu',
    time: 'Il y a 5 min',
  },
  {
    icon: ShoppingBag,
    title: 'Dernier achat : Sac Élise',
    time: 'Il y a 2 semaines',
  },
]

function MessageStatCard({
  icon: Icon,
  label,
  value,
  change,
  danger = false,
}) {
  return (
    <div className="messages-stat-card">
      <div className="messages-stat-card__icon">
        <Icon size={28} strokeWidth={1.65} />
      </div>

      <div className="messages-stat-card__content">
        <span>{label}</span>

        <div className="messages-stat-card__value-row">
          <strong>{value}</strong>

          <small
            className={`messages-stat-card__change ${
              danger ? 'is-danger' : ''
            }`}
          >
            ↗ {change}
          </small>
        </div>

        <em>vs mois dernier</em>
      </div>
    </div>
  )
}

function Avatar({
  src,
  initials,
  alt,
  className = '',
}) {
  return (
    <div className={`messages-avatar ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
      ) : null}
      <span>{initials}</span>
    </div>
  )
}

export default function Messages() {
  const attachmentInputRef = useRef(null)
  const [conversations, setConversations] = useState(
    initialConversations,
  )
  const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedId, setSelectedId] = useState(1)
  const [draft, setDraft] = useState('')
  const [notice, setNotice] = useState('')

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return conversations.filter((conversation) => {
      const matchesTab =
        (activeTab === 'all' && conversation.status !== 'archived') ||
        (activeTab === 'unread' && conversation.unread > 0) ||
        (activeTab === 'pending' &&
          conversation.status === 'pending') ||
        (activeTab === 'resolved' &&
          conversation.status === 'resolved')
      const matchesSearch =
        conversation.name.toLowerCase().includes(normalizedSearch) ||
        conversation.preview
          .toLowerCase()
          .includes(normalizedSearch) ||
        conversation.order.toLowerCase().includes(normalizedSearch)

      return matchesTab && matchesSearch
    })
  }, [activeTab, conversations, searchTerm])

  const availableConversations = conversations.filter(
    (conversation) => conversation.status !== 'archived',
  )
  const selectedConversation =
    availableConversations.find(
      (conversation) => conversation.id === selectedId,
    ) ?? availableConversations[0]

  const selectConversation = (conversationId) => {
    setSelectedId(conversationId)
    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unread: 0,
            }
          : conversation,
      ),
    )
  }

  const sendMessage = () => {
    const text = draft.trim()

    if (!text) {
      return
    }

    setConversations((currentConversations) =>
      currentConversations.map((conversation) => {
        if (conversation.id !== selectedConversation.id) {
          return conversation
        }

        return {
          ...conversation,
          preview: text,
          time: 'Maintenant',
          status: 'open',
          unread: 0,
          messages: [
            ...conversation.messages,
            {
              id: `local-${Date.now()}`,
              sender: 'admin',
              text,
              time: 'Maintenant',
              read: true,
            },
          ],
        }
      }),
    )
    setDraft('')
    setNotice('Reponse envoyee localement.')
  }

  const markResolved = () => {
    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === selectedConversation.id
          ? {
              ...conversation,
              status: 'resolved',
              unread: 0,
            }
          : conversation,
      ),
    )
    setNotice('Conversation marquee comme resolue.')
  }

  const startNewConversation = () => {
    const nextId =
      Math.max(0, ...conversations.map((conversation) => conversation.id)) + 1
    const newConversation = {
      id: nextId,
      name: 'Nouveau client',
      avatar: '',
      initials: 'NC',
      preview: 'Nouvelle conversation locale',
      time: 'Maintenant',
      unread: 0,
      status: 'open',
      online: false,
      order: 'Sans commande',
      customerSince: 'Nouveau contact',
      email: 'client@nova.local',
      phone: '+212 6 00 00 00 00',
      location: 'Maroc',
      orderCount: 0,
      spent: '0 DH',
      tags: ['Nouveau'],
      messages: [
        {
          id: `new-${Date.now()}`,
          sender: 'admin',
          text: 'Bonjour, comment pouvons-nous vous aider ?',
          time: 'Maintenant',
          read: true,
        },
      ],
    }

    setConversations((currentConversations) => [
      newConversation,
      ...currentConversations,
    ])
    setSelectedId(nextId)
    setDraft('')
    setNotice('Nouvelle conversation locale creee.')
  }

  const archiveConversation = () => {
    if (availableConversations.length <= 1) {
      setNotice('Conservez au moins une conversation visible.')
      return
    }

    const nextVisible = availableConversations.find(
      (conversation) => conversation.id !== selectedConversation.id,
    )

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === selectedConversation.id
          ? {
              ...conversation,
              status: 'archived',
              unread: 0,
            }
          : conversation,
      ),
    )

    if (nextVisible) {
      setSelectedId(nextVisible.id)
    }

    setNotice('Conversation archivee localement.')
  }

  const attachFile = (event) => {
    const [file] = Array.from(event.target.files || [])

    if (!file) {
      return
    }

    setDraft((currentDraft) =>
      `${currentDraft}${currentDraft ? ' ' : ''}[Piece jointe: ${file.name}]`,
    )
    setNotice('Piece jointe ajoutee au brouillon.')
    event.target.value = ''
  }

  const addEmoji = () => {
    setDraft((currentDraft) => `${currentDraft}${currentDraft ? ' ' : ''}:)`)
  }

  const addTag = () => {
    const tag = window.prompt('Nouveau tag client')

    if (!tag?.trim()) {
      return
    }

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === selectedConversation.id
          ? {
              ...conversation,
              tags: Array.from(
                new Set([...conversation.tags, tag.trim()]),
              ),
            }
          : conversation,
      ),
    )
    setNotice('Tag ajoute localement.')
  }

  const showCustomerActions = () => {
    setNotice(
      `Options client ouvertes pour ${selectedConversation.name}.`,
    )
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-dashboard messages-page">
          <section className="messages-page__breadcrumb">
            <span>Accueil</span>
            <ChevronRight size={14} strokeWidth={1.7} />
            <strong>Messages</strong>
          </section>

          <section className="messages-page__heading">
            <div>
              <h1>Gestion des messages</h1>

              <p>
                Consultez et gérez les conversations clients en
                temps réel.
              </p>
            </div>

            <button
              className="messages-primary-button"
              type="button"
              onClick={startNewConversation}
            >
              <Plus size={18} strokeWidth={1.8} />
              <span>Nouveau message</span>
            </button>
          </section>

          <section className="messages-stats">
            <MessageStatCard
              icon={MessageCircle}
              label="Messages reçus"
              value="1 248"
              change="+12%"
            />

            <MessageStatCard
              icon={Mail}
              label="Non lus"
              value="18"
              change="+20%"
              danger
            />

            <MessageStatCard
              icon={Users}
              label="Conversations actives"
              value="67"
              change="+34%"
            />

            <MessageStatCard
              icon={Clock3}
              label="Temps moyen de réponse"
              value="8 min"
              change="-15%"
            />
          </section>

          {notice ? <p className="admin-local-notice">{notice}</p> : null}

          <section className="messages-workspace">
            <aside className="dashboard-card messages-list-panel">
              <div className="messages-tabs">
                {tabs.map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={
                      activeTab === value ? 'is-active' : ''
                    }
                    onClick={() => setActiveTab(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="messages-search">
                <Search size={18} strokeWidth={1.7} />
                <input
                  type="search"
                  value={searchTerm}
                  placeholder="Rechercher un message..."
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                />
              </div>

              <div className="messages-conversation-list">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    className={`messages-conversation ${
                      selectedConversation.id === conversation.id
                        ? 'is-selected'
                        : ''
                    }`}
                    onClick={() =>
                      selectConversation(conversation.id)
                    }
                  >
                    <Avatar
                      src={conversation.avatar}
                      initials={conversation.initials}
                      alt={conversation.name}
                    />

                    <span className="messages-conversation__main">
                      <strong>{conversation.name}</strong>
                      <em>{conversation.preview}</em>
                    </span>

                    <span className="messages-conversation__meta">
                      <span>{conversation.time}</span>
                      {conversation.unread > 0 ? (
                        <strong>{conversation.unread}</strong>
                      ) : null}
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <section className="dashboard-card messages-chat-panel">
              <header className="messages-chat-header">
                <div className="messages-chat-header__profile">
                  <Avatar
                    src={selectedConversation.avatar}
                    initials={selectedConversation.initials}
                    alt={selectedConversation.name}
                    className="messages-avatar--large"
                  />

                  <div>
                    <div className="messages-chat-header__title">
                      <h2>{selectedConversation.name}</h2>
                      {selectedConversation.online ? (
                        <span>
                          <i />
                          En ligne
                        </span>
                      ) : null}
                    </div>

                    <p>
                      {selectedConversation.order}
                      <span />
                      {selectedConversation.customerSince}
                    </p>
                  </div>
                </div>

                <div className="messages-chat-actions">
                  <button type="button" onClick={archiveConversation}>
                    <Archive size={17} strokeWidth={1.7} />
                    <span>Archiver</span>
                  </button>

                  <button
                    className="is-primary"
                    type="button"
                    onClick={markResolved}
                  >
                    <Check size={17} strokeWidth={1.8} />
                    <span>Marquer résolu</span>
                  </button>
                </div>
              </header>

              <div className="messages-chat-body">
                <div className="messages-day-divider">
                  Aujourd’hui
                </div>

                {selectedConversation.messages.map((message) => (
                  <div
                    className={`messages-chat-message messages-chat-message--${message.sender}`}
                    key={message.id}
                  >
                    {message.sender === 'customer' ? (
                      <Avatar
                        src={selectedConversation.avatar}
                        initials={selectedConversation.initials}
                        alt={selectedConversation.name}
                        className="messages-avatar--tiny"
                      />
                    ) : null}

                    <div className="messages-bubble-wrap">
                      <div className="messages-bubble">
                        {message.text
                          .split('\n')
                          .map((line, index) => (
                            <span key={`${message.id}-${index}`}>
                              {line || '\u00a0'}
                            </span>
                          ))}
                      </div>

                      <div className="messages-message-time">
                        {message.time}
                        {message.sender === 'admin' &&
                        message.read ? (
                          <CheckCheck
                            size={14}
                            strokeWidth={1.8}
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <footer className="messages-composer">
                <button
                  type="button"
                  aria-label="Joindre un fichier"
                  onClick={() => attachmentInputRef.current?.click()}
                >
                  <Paperclip size={19} strokeWidth={1.8} />
                </button>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  hidden
                  onChange={attachFile}
                />

                <div className="messages-composer__input">
                  <input
                    type="text"
                    value={draft}
                    placeholder="Écrire votre réponse..."
                    onChange={(event) =>
                      setDraft(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        sendMessage()
                      }
                    }}
                  />

                  <button
                    className="messages-composer__emoji"
                    type="button"
                    aria-label="Ajouter une reaction"
                    onClick={addEmoji}
                  >
                    <Smile size={19} strokeWidth={1.7} />
                  </button>
                </div>

                <button
                  className="messages-send-button"
                  type="button"
                  aria-label="Envoyer le message"
                  onClick={sendMessage}
                >
                  <Send size={19} strokeWidth={1.8} />
                </button>
              </footer>
            </section>

            <aside className="dashboard-card messages-detail-panel">
              <div className="messages-detail-heading">
                <h2>Détails du client</h2>
                <button
                  type="button"
                  aria-label="Plus d’options"
                  onClick={showCustomerActions}
                >
                  <MoreVertical size={18} strokeWidth={1.8} />
                </button>
              </div>

              <div className="messages-customer-card">
                <Avatar
                  src={selectedConversation.avatar}
                  initials={selectedConversation.initials}
                  alt={selectedConversation.name}
                  className="messages-avatar--xl"
                />

                <div>
                  <strong>{selectedConversation.name}</strong>

                  <span>
                    <Mail size={14} />
                    {selectedConversation.email}
                  </span>

                  <span>
                    <Phone size={14} />
                    {selectedConversation.phone}
                  </span>

                  <span>
                    <MapPin size={14} />
                    {selectedConversation.location}
                  </span>
                </div>
              </div>

              <div className="messages-customer-metrics">
                <div>
                  <ShoppingCart size={22} strokeWidth={1.7} />
                  <span>Total de commandes</span>
                  <strong>
                    {selectedConversation.orderCount}
                  </strong>
                </div>

                <div>
                  <Package size={22} strokeWidth={1.7} />
                  <span>Total dépensé</span>
                  <strong>{selectedConversation.spent}</strong>
                </div>
              </div>

              <div className="messages-tags">
                <div>
                  <h3>Tags</h3>
                  <button type="button" onClick={addTag}>
                    + Ajouter un tag
                  </button>
                </div>

                <div className="messages-tags__list">
                  {selectedConversation.tags.map((tag) => (
                    <span
                      className={
                        tag === 'VIP' ? 'is-vip' : ''
                      }
                      key={tag}
                    >
                      {tag === 'VIP' ? <i /> : null}
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="messages-activity">
                <h3>Activité récente</h3>

                <div className="messages-activity__list">
                  {activity.map((item) => {
                    const Icon = item.icon

                    return (
                      <div key={item.title}>
                        <span className="messages-activity__dot" />

                        <div className="messages-activity__icon">
                          <Icon size={20} strokeWidth={1.7} />
                        </div>

                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.time}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </div>
  )
}
