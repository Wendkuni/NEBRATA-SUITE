import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  AvatarUserPipe,
  GenralDownloadPipe,
  AvatarLogoPipe
} from './profilePicture/profilePicture.pipe';
import { ChatPersonSearchPipe } from './search/chat-person-search.pipe';
import { TruncatePipe } from './truncate/truncate.pipe';
import { MailSearchPipe } from './search/mail-search.pipe';
import { ExceptPrincipalFilterPipe, PrincipalContactFilterPipe,PrincipalAdresseFilterPipe, AffectationAgentFilterPipe } from './profilePicture/contactUser.pipe';
import { HtmlToTextPipe } from './html-to-text/html-to-text.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        GenralDownloadPipe,
        AvatarUserPipe,
        AvatarLogoPipe,
        ChatPersonSearchPipe,
        ExceptPrincipalFilterPipe,
        TruncatePipe,
        MailSearchPipe,
        PrincipalContactFilterPipe,
        PrincipalAdresseFilterPipe,
        AffectationAgentFilterPipe,
        HtmlToTextPipe
    ],
    exports: [
        ChatPersonSearchPipe,
        AvatarUserPipe,
        AvatarLogoPipe,
        GenralDownloadPipe,
        ExceptPrincipalFilterPipe,
        TruncatePipe,
        MailSearchPipe,
        PrincipalContactFilterPipe,
        PrincipalAdresseFilterPipe,
        AffectationAgentFilterPipe,
        HtmlToTextPipe
    ]
})
export class PipesModule { }
