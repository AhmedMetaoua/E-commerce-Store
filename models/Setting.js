import mongoose, { model, models, Schema } from 'mongoose'

const UserRoleSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
}, { _id: false }) // Disable _id for subdocuments if not needed

const ContactSchema = new Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
}, { _id: false })

const SettingSchema = new Schema({
  storeName: { type: String, required: true },
  users: { type: [UserRoleSchema], default: [] },
  contact: { type: ContactSchema, default: {} },
  featuredProduct: { type: mongoose.Types.ObjectId, ref: 'Product' }
}, { timestamps: true })

const Setting = models.Setting || model('Setting', SettingSchema)

export default Setting
