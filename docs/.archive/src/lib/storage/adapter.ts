import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "#/env";
import type { StorageAdapter } from "./types";

export type { StorageAdapter };

export function createS3Adapter(): StorageAdapter {
	const s3Client = new S3Client({
		credentials: {
			accessKeyId: env.S3_ACCESS_KEY,
			secretAccessKey: env.S3_SECRET_KEY,
		},
		endpoint: env.S3_ENDPOINT,
		forcePathStyle: true,
		region: env.S3_REGION || "us-east-1",
	});

	const bucketName = env.S3_BUCKET || "shaun-uploads";

	return {
		async deleteObject(key) {
			const command = new DeleteObjectCommand({
				Bucket: bucketName,
				Key: key,
			});
			await s3Client.send(command);
		},
		async getPresignedUploadUrl(key, contentType, expiresIn = 300) {
			const command = new PutObjectCommand({
				Bucket: bucketName,
				ContentType: contentType,
				Key: key,
			});

			const url = await getSignedUrl(s3Client, command, { expiresIn });
			const publicUrl = this.getPublicUrl(key);

			return { publicUrl, url };
		},

		getPublicUrl(key) {
			const endpoint = env.S3_ENDPOINT || "";
			const baseUrl = endpoint.endsWith("/") ? endpoint.slice(0, -1) : endpoint;
			return `${baseUrl}/${bucketName}/${key}`;
		},
	};
}

export function createMemoryAdapter(): StorageAdapter {
	const store = new Map<string, Uint8Array>();

	return {
		async deleteObject(key) {
			store.delete(key);
		},
		async getPresignedUploadUrl(key, _contentType, _expiresIn) {
			return {
				publicUrl: `http://localhost:9000/shaun-uploads/${key}`,
				url: `http://localhost:9000/upload/${key}`,
			};
		},

		getPublicUrl(key) {
			return `http://localhost:9000/shaun-uploads/${key}`;
		},
	};
}
