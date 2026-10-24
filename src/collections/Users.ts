import type { Access, CollectionConfig } from 'payload'

const isAppUser: Access = ({ req }) => req.user?.collection === 'users'

const isSelf: Access = ({ req }) => {
  if (req.user?.collection !== 'users') return false
  return { id: { equals: req.user.id } }
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
  },
  access: {
    create: () => true,
    delete: isSelf,
    read: isSelf,
    update: isSelf,
    unlock: isAppUser,
  },
  admin: {
    hidden: true,
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 80,
    },
  ],
}
