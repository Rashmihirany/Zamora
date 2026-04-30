import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
  _id: mongoose.Types.ObjectId;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  timezone: string;
  maintenanceMode: boolean;
  notifications: {
    emailOnOrder: boolean;
    emailOnLowStock: boolean;
    emailOnNewUser: boolean;
  };
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>({
  storeName: { type: String, default: 'ZAMORA' },
  storeEmail: { type: String, default: 'contact@zamora.com' },
  storePhone: { type: String, default: '+1 (555) 000-0000' },
  storeAddress: { type: String, default: '123 Fashion Ave, New York, NY 10001' },
  currency: { type: String, default: 'USD', enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] },
  timezone: { type: String, default: 'America/New_York' },
  maintenanceMode: { type: Boolean, default: false },
  notifications: {
    emailOnOrder: { type: Boolean, default: true },
    emailOnLowStock: { type: Boolean, default: true },
    emailOnNewUser: { type: Boolean, default: false },
  },
  updatedAt: { type: Date, default: Date.now },
});

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
