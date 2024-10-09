export class Attempt {
    constructor(
        public number: number,
        public compilationScore: number,
        public testsScore: number,
        public qualityScore: number,
        public maxScore: number,
        public minScore: number
    ) {}
}