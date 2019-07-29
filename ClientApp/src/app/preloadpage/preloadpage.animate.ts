import { trigger, transition, style, animate, animation, useAnimation } from '@angular/animations';


let appearLeftAnimation = animation([
    style({transform: 'translateX(100%)',
    'font-size' : '150%',
    'font-weight': 'bolder'
   }),
    animate('{{ duration }} {{ easing }}')
], { params : {easing : 'ease-out', duration : '1500ms' } })

let appearOpacityAnimation = animation([
    style({opacity: '0',
    'font-size' : '50%',
    'font-weight': 'bolder'
   }),
    animate('{{ duration }} {{ easing }}')
], { params : {easing : 'ease-out', duration : '1500ms' } })


export const appearLeftTrigger = trigger('appearLeft', [
    transition('void => *', [
        useAnimation(appearLeftAnimation, { params : {easing : 'ease-out', duration : '1200ms' } })
    ])
  ])


export const appearOpacityTrigger = trigger('appearOpacity', [
    transition('void => *', [
        useAnimation(appearOpacityAnimation, { params : {easing : 'ease-out', duration : '1200ms' } })
    ])
  ])

