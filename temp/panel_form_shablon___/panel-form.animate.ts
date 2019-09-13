import { trigger, transition, style, animate, animation, useAnimation, keyframes } from '@angular/animations';


let disappearAnimation = animation(
    [
        animate('{{ duration }} {{ easing }}',
        keyframes([
            style({offset : 0.3, opacity : 0.3}),
            style({offset : 1,   transform: 'translateX(-150%)'})
            ])
        )          
    ],
    { params : {easing : 'ease-out', duration : '500ms' } }
    );              
                            
    let appearAnimation = animation(
        [
            style({opacity : 0.3 ,   transform: 'translateX(-150%)'}),
            animate('{{ duration }} {{ easing }}')          
        ],
        { params : {easing : 'ease-out', duration : '500ms' } }
        );              
    

export const disappearTrigger = trigger('disappear', [
    transition('* => void', [
        useAnimation(disappearAnimation, { params : {easing : 'ease-out', duration : '500ms' } })
    ]),
    transition('void => *', [
        useAnimation(appearAnimation, { params : {easing : 'ease-out', duration : '500ms' } })
    ])
  ])