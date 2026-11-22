-- Better Auth 1.7.3+ identifies account records by providerId and accountId.
-- This database was initialized with the transient Better Auth 1.7.0-1.7.2
-- issuer requirement. The old index must be removed before dropping its column.
DROP INDEX "account_issuer_accountId_uidx";

ALTER TABLE "account" DROP COLUMN "issuer";

CREATE UNIQUE INDEX "account_providerId_accountId_uidx" ON "account"("providerId", "accountId");
