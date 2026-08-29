import type {
  CheckIn,
  Prisma,
} from '../../prisma/generated/prisma/browser'

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}
