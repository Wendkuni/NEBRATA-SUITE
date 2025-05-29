import {trigger, stagger, animate, style, query, transition, keyframes, state, animateChild} from '@angular/animations';

export const blockTransition = trigger('blockTransition', [
    transition(':enter', [
        query('.block', style({ opacity: 0 }),{ optional: true }),
        query('.block', stagger(150, [
            style({ transform: 'translateY(100px)' }),
            animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(0px)', opacity: 1})),
        ]),{ optional: true }),
    ]),
    transition(':leave', [
        query('.block', stagger(100, [
            style({ transform: 'translateY(0px)', opacity: 1 }),
            animate('1s cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(100px)', opacity: 0})),
        ]),{ optional: true }),        
    ])
]);

export const MenuButtonAnimation = trigger('buttonMenuState', [
    state('false', style({ transform: 'rotate(0deg)' })),
    state('true', style({ transform: 'rotate(0deg)' })),
    transition('false => true', [style({transform: 'rotate(-180deg)'}), animate('450ms ease-out')]),
    transition('true => false', [style({transform: 'rotate(180deg)'}), animate('450ms ease-out')])
  ]);
  

  export const ListItemState =   trigger('listItemState', [
    transition('void => *', [
        style({transform: 'translateX(-10px)'}),
        animate('0.3s  cubic-bezier(.75,-0.48,.26,1.52)', style({transform: 'translateY(0px)', opacity: 1})),
    ]),
])


 