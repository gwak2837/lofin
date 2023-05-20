export function applyLineBreak(sentences: string) {
  return sentences.split('\n').map((c) => (
    <>
      <p>{c}</p>
      <br />
    </>
  ))
}
