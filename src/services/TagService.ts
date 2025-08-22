import AsyncStorage from '@react-native-async-storage/async-storage';
import {Tag, Location} from '../types';
import {isWithinRadius} from '../utils/distance';

const TAGS_STORAGE_KEY = '@tags';

export class TagService {
  static async saveTags(tags: Tag[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(tags);
      await AsyncStorage.setItem(TAGS_STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving tags:', error);
      throw error;
    }
  }

  static async getAllTags(): Promise<Tag[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(TAGS_STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading tags:', error);
      return [];
    }
  }

  static async addTag(tag: Omit<Tag, 'id' | 'createdAt'>): Promise<Tag> {
    try {
      const existingTags = await this.getAllTags();
      const newTag: Tag = {
        ...tag,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      };
      
      const updatedTags = [...existingTags, newTag];
      await this.saveTags(updatedTags);
      return newTag;
    } catch (error) {
      console.error('Error adding tag:', error);
      throw error;
    }
  }

  static async getTagsWithinRadius(
    userLocation: Location,
    radiusMiles: number,
  ): Promise<Tag[]> {
    try {
      const allTags = await this.getAllTags();
      return allTags.filter(tag =>
        isWithinRadius(userLocation, tag.location, radiusMiles),
      );
    } catch (error) {
      console.error('Error filtering tags by radius:', error);
      return [];
    }
  }

  static validateTagLocation(
    userLocation: Location,
    tagLocation: Location,
  ): boolean {
    return isWithinRadius(userLocation, tagLocation, 0.5);
  }
}