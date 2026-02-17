export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  password?: string;
}

export enum TournamentStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum PlayerStatus {
  ACTIVE = 'ACTIVE',
  DISQUALIFIED = 'DISQUALIFIED',
}

export interface KafkaMessage<T = any> {
  correlationId: string;
  command: string;
  payload: T;
  timestamp: number;
  playerId?: string;
}

export interface KafkaResponse<T = any> {
  correlationId: string;
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateTournamentPayload {
  gameType: string;
  tournamentType: string;
  entryFee: number;
}

export interface JoinTournamentPayload {
  playerId: string;
  tournamentId: string;
}

export interface GetMyTournamentsPayload {
  playerId: string;
}

export interface GetTournamentPayload {
  id?: string;
  gameType?: string;
  tournamentType?: string;
  status?: TournamentStatus;
}

export interface TournamentDto {
  id: string;
  gameType: string;
  tournamentType: string;
  entryFee: number;
  status: TournamentStatus;
  players: TournamentPlayerDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TournamentPlayerDto {
  id: string;
  playerId: string;
  playerName?: string;
  joinedAt: Date;
  status: PlayerStatus;
}

export const KAFKA_TOPICS = {
  TOURNAMENT_COMMAND_CREATE: 'tournament.command.create',
  TOURNAMENT_COMMAND_JOIN: 'tournament.command.join',
  TOURNAMENT_QUERY_MY_TOURNAMENTS: 'tournament.query.my-tournaments',
  TOURNAMENT_QUERY_GET: 'tournament.query.get',
  TOURNAMENT_QUERY_LIST: 'tournament.query.list',
  TOURNAMENT_RESPONSE: 'tournament.response',
};

export const NATS_SUBJECTS = {
  USER_GET: 'user.get',
  USER_VALIDATE: 'user.validate',
  USER_AUTHENTICATE: 'user.authenticate',
};
