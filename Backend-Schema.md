# SecureStash Backend Schema

## Firestore

- users/{uid}/files/{fileId}
  - name: string
  - path: string // Storage path files/{uid}/{fileId}/{filename}
  - size: number
  - contentType: string
  - createdAt: Timestamp
  - updatedAt: Timestamp

- users/{uid}/starred/{fileId}
  - fileRef: DocumentReference<users/{uid}/files/{fileId}>
  - starredAt: Timestamp

- shares/{shareId}
  - ownerId: string
  - filePath: string // storage path
  - recipients: string[] // recipient user UIDs
  - createdAt: Timestamp

## Storage

- files/{uid}/{fileId}/{filename}
- thumbnails/{uid}/{fileId}/{filename} (optional, public read)

## Cloud Functions

- callable: createFileMetadata({ name, size, contentType }) -> { id, path }
- callable: starFile({ fileId, value })
- callable: deleteFile({ fileId })
- callable: createShare({ fileId, recipients }) -> { id }
- callable: revokeShare({ shareId })
- http GET: /getDownloadUrl?fileId=...  (Authorization: Bearer <ID_TOKEN>) -> { url }

## Security Rules

- Firestore: users/* restricted to owner; shares readable by owner or recipient.
- Storage: files/* restricted to owner UID; thumbnails public read.
