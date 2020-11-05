import { UserResolver } from './user/resolver';
import { EventResolver } from './event/resolver';
import { ContestantResolver } from './contestant/resolver';
import { ContentResolver } from './content/resolver';
import { VoteResolver } from './vote/resolver';
import { WalletResolver } from './wallet/resolver';

export default [UserResolver,
    EventResolver,
    ContestantResolver,
    ContentResolver,
    VoteResolver,
    WalletResolver
] as const;
