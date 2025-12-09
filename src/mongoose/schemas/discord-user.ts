import mongoose, { Document } from "mongoose";

export interface IDiscordUserDocument extends Document {
  username: string;
  discordId: string;
}

const DiscordUserSchema = new mongoose.Schema<IDiscordUserDocument>({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  discordId: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
});

export const DiscordUser = mongoose.model<IDiscordUserDocument>("DiscordUser", DiscordUserSchema);
