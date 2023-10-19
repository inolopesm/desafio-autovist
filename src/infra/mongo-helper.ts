import * as mongo from "mongodb";

export class MongoHelper {
  private client: mongo.MongoClient | null = null;

  async connect(url: string): Promise<void> {
    this.client = new mongo.MongoClient(url);
    await this.client.connect();
  }

  getCollection<TSchema extends mongo.Document = mongo.Document>(
    name: string
  ): mongo.Collection<TSchema> {
    if (this.client === null) throw new Error("Mongo not connected");
    return this.client.db().collection(name);
  }

  private static instance: MongoHelper | null = null;

  static getInstance(): MongoHelper {
    if (MongoHelper.instance === null) {
      MongoHelper.instance = new MongoHelper();
    }

    return MongoHelper.instance;
  }
}
