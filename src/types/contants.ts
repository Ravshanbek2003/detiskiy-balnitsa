import {
   CollectionConstants,
   RoleConstants,
   StatusConstants,
} from '../constants'

export type RoleConstantsType =
   (typeof RoleConstants)[keyof typeof RoleConstants]

export type StatusConstantsType =
   (typeof StatusConstants)[keyof typeof StatusConstants]

export type CollectionConstantsType =
   (typeof CollectionConstants)[keyof typeof CollectionConstants]
