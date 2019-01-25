import { Avatar } from '../models';

const AVATAR_SIZE_RANK = ['tiny', 'small', 'medium', 'large', 'original'];

export class AvatarUtil {

  /** Utility for retrieving the ideal sized image from a resource avatar. */
  static getAvatarBySize(avatar: Avatar, preferredSize: string): string {
    if (avatar == null) {
      return avatar as null | undefined;
    }

    if (!AVATAR_SIZE_RANK.includes(preferredSize)) {
      throw Error('Invalid size ' + preferredSize);
    }

    // Shallow copy the ranks for manipulation
    let ranks = AVATAR_SIZE_RANK.slice();

    // Remove options that are too small
    const preferredSizeIndex = ranks.indexOf(preferredSize);
    const tooSmall = ranks.splice(0, preferredSizeIndex);

    // Append too-small options to the end, in reverse order
    ranks = ranks.concat(tooSmall.reverse());

    // Find the first match
    const match = ranks.find(rank => avatar[rank] != null);

    return match ? avatar[match] : null;
  }

  /** Return a list of images sizes that are greater or equal than the supplied target. */
  static getAllowableAvatarSizes(targetSize: string) {
    return AVATAR_SIZE_RANK.filter((s, i) => i >= AVATAR_SIZE_RANK.indexOf(targetSize));
  }
}
